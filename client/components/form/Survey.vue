<script lang="ts" setup>
import { onKeyDown } from '@vueuse/core'

const props = defineProps<{
  simulateurId: string
  autocompleteFunctions?: Record<string, (query: string) => Promise<any[]>>
}>()

// Composables
const matomo = useMatomo()
const { isIframe } = useIframeDisplay()
const { useHasValidAnswer } = useFormValidation()
const route = useRoute()

// Local state
const isLoading = ref(true)
const resultsFetchState = ref<'idle' | 'loading' | 'success' | 'error'>('idle')
const showChoiceScreen = ref(false)
const showWelcomeScreen = ref(false)
const questionContainer = ref<HTMLElement | null>(null)

const formStore = useFormStore()
const {
  currentQuestion,
  schema: surveySchema,
  answers,
  progress,
  isLastQuestion,
  currentStepIndex,
  hasAnswers,
} = storeToRefs(formStore) // maintain reactivity
const {
  loadSurveySchema,
  goToNextQuestion,
  goToPreviousQuestion,
  resetForm,
  setAnswer,
} = formStore

const surveyDebugStore = useSurveyDebugStore()
const {
  debugMode,
} = storeToRefs(surveyDebugStore) // maintain reactivity


// Computed values
const simulateurId = props.simulateurId

// Get autocomplete function for current question
const getAutocompleteFn = computed(() => {
  if (currentQuestion.value?.autocompleteFunction && props.autocompleteFunctions) {
    return props.autocompleteFunctions[currentQuestion.value.autocompleteFunction]
  }
  return undefined
})

// Check if the current question has been answered
const hasAnswer = useHasValidAnswer(currentQuestion, answers)

// Heading levels based on iframe context
const surveyH1 = computed(() => isIframe.value ? 'h1' : 'h2')
const surveyH2 = computed(() => isIframe.value ? 'h2' : 'h3')

// Load form when component mounts
onMounted(async () => {
  try {
    await loadSurveySchema(simulateurId)
    isLoading.value = false

    // Resume the form if the query parameter is present
    const doResume = computed(() => route.query.resume === 'true')
    // Enable debug mode if the debug parameter is present
    const enableDebug = computed(() => route.query.debug === 'true')

    if (enableDebug.value && !debugMode.value) {
      surveyDebugStore.toggleDebugMode()
    }

    if (doResume.value) {
      resumeForm()
      // Remove the query param
      navigateTo({ query: { ...route.query, resume: undefined } })
    }

    // Afficher l'écran de choix si un formulaire est en cours
    showChoiceScreen.value = hasAnswers.value && !doResume.value
    showWelcomeScreen.value = !hasAnswers.value && !doResume.value

    // Track form start in Matomo
    matomo.trackSurveyStart(simulateurId)
  }
  catch (error) {
    console.error('Error loading form:', error)
    isLoading.value = false
  }
})

// Focus on the question container after navigation
function focusRenderedQuestion () {
  nextTick(() => {
    if (questionContainer.value) {
      // Focus the first focusable input field inside the question container
      const focusable = questionContainer.value.querySelector('input, select, textarea')
      if (focusable) {
        (focusable as HTMLElement).focus()
      }
    }
  })
}

// If Enter is pressed and there's an answer, go to next question
onKeyDown('Enter', () => {
  if (hasAnswer.value) {
    handleNext()
  }
}, { target: questionContainer })

// Scroll to element by ID
function scrollToAnchor (anchor: string) {
  const element = document.getElementById(anchor)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}

// Start the survey
function handleStart () {
  showWelcomeScreen.value = false
  scrollToAnchor('simulateur-title')
}

// Handle updates from question components
function handleQuestionUpdate (questionId: string, value: any) {
  setAnswer(questionId, value)
}

// Navigate to next question or submit form
function handleNext () {
  if (isLastQuestion.value) {
    submitForm()
  }
  else {
    goToNextQuestion()
    focusRenderedQuestion()
  }
}

// Navigate to previous question
function handlePrevious () {
  const prevQuestion = goToPreviousQuestion()
  if (prevQuestion === false) {
    // If we are at the first question, show the welcome screen
    showWelcomeScreen.value = true
  }
  focusRenderedQuestion()
}

// Resume an in-progress form
function resumeForm () {
  resultsFetchState.value = 'idle'
  showChoiceScreen.value = false
  showWelcomeScreen.value = false
  scrollToAnchor('simulateur-title')
  focusRenderedQuestion()
}

// Restart the form from the beginning
function restartForm () {
  resetForm()
  resultsFetchState.value = 'idle'
  showWelcomeScreen.value = true
  showChoiceScreen.value = false
  scrollToAnchor('simulateur-title')
  focusRenderedQuestion()
}

// Results store for handling simulation results
const resultStore = useResultsStore()

// Submit the form for processing
async function submitForm () {
  // Process the final form data from the answers store
  console.log('Form submitted with answers:', answers.value)

  const questionsToApi: string[] = [
    'locapass-eligibilite',
    'mobilite-master-1',
    'mobilite-parcoursup',
    'aide-personnalisee-logement',
    'garantie-visale-eligibilite',
    'garantie-visale'
  ]

  // Sending the data to a web API to calculate a set of 'aides'
  try {
    resultsFetchState.value = 'loading'
    const request: OpenFiscaCalculationRequest = buildRequest(answers.value, questionsToApi)
    const openfiscaResponse: OpenFiscaCalculationResponse = await fetchOpenFiscaFranceCalculation(request)
    console.debug('Réponse reçue :', openfiscaResponse)

    const results: SimulationResultsAides = extractAidesResults(openfiscaResponse, questionsToApi)
    console.debug('Résulats de simulation extraits :', results)

    if (results) {
      handleResults(results)
    }

    // Track form submission in Matomo
    matomo.trackSurveySubmit(simulateurId)

    // Store form data and results
    try {
      const storeResponse = await $fetch('/api/store-form-data', {
        method: 'POST',
        body: {
          simulateurId,
          answers: answers.value,
          results,
        },
      })

      if (storeResponse.success) {
        console.info('Form data stored successfully:', storeResponse.filename)
      }
      else {
        console.error('Failed to store form data:', storeResponse.error)
      }
    }
    catch (storageError) {
      console.error('Error storing form data:', storageError)
    }
  }
  catch (error) {
    handleResultsFetchError()
    console.error('Erreur inattendue lors de la soumission du formulaire et de l\'appel au calcul :', error)
  }
}

// Process successful results
function handleResults (results: SimulationResultsAides) {
  resultsFetchState.value = 'success'
  resultStore.setResults(simulateurId, results)
  setTimeout(() => {
    navigateTo(`/simulateurs/${simulateurId}/resultats#simulateur-title`)
  }, 1000)
}

// Handle errors during result fetching
function handleResultsFetchError () {
  resultsFetchState.value = 'error'
  setTimeout(() => {
    resumeForm()
  }, 1500)
}
</script>

<template>
  <div>
    <component
      :is="surveyH1"
      class="fr-sr-only"
    >
      Votre simulation
    </component>

    <!-- Écran de choix (reprendre ou recommencer) -->
    <div v-if="showChoiceScreen">
      <div class="fr-card fr-card--shadow fr-p-3w">
        <component
          :is="surveyH2"
          class="fr-h4"
        >
          <VIcon
            name="ri:information-line"
            ssr
          />
          Vous avez un formulaire en cours
        </component>
        <DsfrBadge
          class="fr-mt-n1w fr-mb-2w"
          type="info"
          :label="`Progression : ${progress}%`"
        />
        <p class="fr-text--lg">
          Souhaitez-vous reprendre votre formulaire là où vous vous êtes arrêté ou recommencer à zéro ?
        </p>
        <div class="fr-btns-group brand-form-actions fr-mt-1w">
          <DsfrButton
            class="brand-form-actions__button"
            label="Reprendre"
            :icon="{ name: 'ri:play-line', ssr: true }"
            @click="resumeForm"
          />
          <DsfrButton
            class="brand-form-actions__button"
            label="Recommencer"
            secondary
            :icon="{ name: 'ri:restart-line', ssr: true }"
            @click="restartForm"
          />
        </div>
      </div>
    </div>

    <!-- Écran de bienvenue -->
    <div v-else-if="showWelcomeScreen">
      <div class="fr-card fr-card--shadow fr-p-3w">
        <component
          :is="surveyH2"
          class="fr-h4"
        >
          <VIcon
            name="ri:information-line"
            ssr
          />
          Un simulateur en construction
        </component>
        <p>
          <span class="fr-text--bold">Bienvenue !</span>
          Ce simulateur vous permet d'estimer 5 aides financières pour le logement et le déménagement, en particulier
          destinées aux étudiants.
          <DsfrLink
            to="/aides"
            target="_blank"
            label="Consulter la liste des aides couvertes."
            :icon="{ name: 'ri:arrow-right-line', ssr: true }"
          />
        </p>
        <p>
          Nous continuons à l’améliorer. Vos retours sont précieux :
        </p>
        <ul class="fr-mt-n2w fr-mb-2w">
          <li>
            Par mail à l'adresse
            <DsfrLink
              to="mailto:aides.simplifiees@numerique.gouv.fr"
              :icon="{ name: 'ri:mail-line', ssr: true }"
              label="aides.simplifiees@numerique.gouv.fr"
            />
          </li>
          <li>
            Via
            <DsfrLink
              :icon="{ name: 'ri:external-link-line', ssr: true }"
              to="https://tally.so/r/w27b9D"
              target="_blank"
              label="le questionnaire de satisfaction"
            />
          </li>
        </ul>
        <p>
          Merci pour votre aide !
        </p>
        <p>
          En accédant à ce service, vous reconnaissez avoir pris connaissance et accepté les <DsfrLink
            to="/content/cgu"
            label="Conditions Générales d'Utilisation"
            target="_blank"
          />
        </p>

        <div class="fr-btns-group brand-form-actions">
          <DsfrButton
            class="brand-form-actions__button fr-mt-1w"
            label="Commencer la simulation"
            :icon="{ name: 'ri:play-line', ssr: true }"
            @click="handleStart"
          />
        </div>
      </div>
    </div>

    <!-- Formulaire -->
    <template v-else>
      <template v-if="isLoading">
        <div class="state-panel fr-card fr-card--shadow fr-p-3w">
          <p class="loading-indicator fr-text--xl fr-mt-3w">
            <span
              class="fr-icon-refresh-line fr-icon fr-icon--md fr-mr-2w"
              aria-hidden="true"
            />Chargement du
            formulaire...
          </p>
        </div>
      </template>
      <div
        v-else-if="!surveySchema"
        class="fr-card fr-card--shadow fr-py-5w fr-text--center"
      >
        <p>Erreur lors du chargement du formulaire</p>
      </div>
      <template v-else-if="surveySchema">
        <DsfrStepper
          v-if="currentStepIndex"
          :steps="surveySchema?.steps.map(step => step.title).filter(Boolean) || []"
          :current-step="currentStepIndex"
        />
        <div
          v-if="surveySchema && currentQuestion"
          class="form-container fr-card fr-p-3w"
        >
          <div
            v-if="resultsFetchState !== 'idle'"
            class="state-panel"
          >
            <p
              v-if="resultsFetchState === 'loading'"
              class="loading-indicator fr-text--xl fr-mt-3w"
            >
              <span
                class="fr-icon-refresh-line fr-icon fr-icon--md fr-mr-1v"
                aria-hidden="true"
              />Estimation en
              cours...
            </p>
            <DsfrBadge
              v-if="resultsFetchState === 'error' || resultsFetchState === 'success'"
              class="survey-fetch-state-badge"
              :type="({
                // idle: 'info',
                loading: 'info',
                success: 'success',
                error: 'error',
              }[resultsFetchState] as 'info' | 'success' | 'error')"
              :label="{
                // idle: `progression : ${progress}%`,
                loading: 'Estimation en cours...',
                success: 'Estimation terminée',
                error: 'Erreur lors de l\'estimation',
              }[resultsFetchState]"
            />
          </div>
          <!-- Current Question -->
          <div
            v-if="resultsFetchState === 'idle'"
            class="fr-form-group"
          >
            <hgroup class="fr-mb-3w">
              <component
                :is="surveyH2"
                class="fr-h5 fr-mb-1w"
              >
                {{ currentQuestion?.title }}
              </component>
              <p
                v-if="currentQuestion?.description"
                class="fr-hint-text fr-text--sm"
              >
                {{ currentQuestion?.description }}
              </p>
            </hgroup>
            <!-- Question component based on type -->
            <template v-if="currentQuestion">
              <div
                ref="questionContainer"
                class="question-actual-container"
              >
                <DsfrButton
                  v-if="currentQuestion?.notion"
                  :label="currentQuestion?.notion.buttonLabel"
                  icon="ri:information-line"
                  secondary
                  icon-right
                  class="fr-mb-2w"
                  @click="() => {
                    navigateTo(`/simulateurs/${simulateurId}/${currentQuestion?.notion.id}#simulateur-title`)
                  }"
                />
                <RadioButtonQuestion
                  v-if="currentQuestion.type === 'radio'"
                  :question="currentQuestion"
                  :model-value="(answers[currentQuestion.id] as string)"
                  @update:model-value="value => currentQuestion && handleQuestionUpdate(currentQuestion.id, value)"
                />

                <BooleanQuestion
                  v-else-if="currentQuestion.type === 'boolean'"
                  :question="currentQuestion"
                  :model-value="(answers[currentQuestion.id] as boolean)"
                  @update:model-value="value => currentQuestion && handleQuestionUpdate(currentQuestion.id, value)"
                />

                <MultiSelectQuestion
                  v-else-if="currentQuestion.type === 'checkbox'"
                  :question="currentQuestion"
                  :model-value="(answers[currentQuestion.id] as string[])"
                  @update:model-value="value => currentQuestion && handleQuestionUpdate(currentQuestion.id, value)"
                />

                <NumberQuestion
                  v-else-if="currentQuestion.type === 'number'"
                  :question="currentQuestion"
                  :model-value="(answers[currentQuestion.id] as number)"
                  @update:model-value="value => currentQuestion && handleQuestionUpdate(currentQuestion.id, value)"
                />

                <DateQuestion
                  v-else-if="currentQuestion.type === 'date'"
                  :question="currentQuestion"
                  :model-value="(answers[currentQuestion.id] as string)"
                  @update:model-value="value => currentQuestion && handleQuestionUpdate(currentQuestion.id, value)"
                />

                <TextQuestion
                  v-else-if="currentQuestion.type === 'text'"
                  :question="currentQuestion"
                  :model-value="(answers[currentQuestion.id] as string)"
                  :autocomplete-fn="getAutocompleteFn"
                  @update:model-value="value => currentQuestion && handleQuestionUpdate(currentQuestion.id, value)"
                />
              </div>
            </template>
          </div>
        </div>
        <div class="fr-btns-group fr-btns-group--lg fr-mt-4w brand-form-actions brand-form-actions__align-end">
          <DsfrButton
            class="brand-form-actions__button"
            label="Précédent"
            secondary
            size="lg"
            :icon="{ name: 'ri:arrow-left-line', ssr: true }"
            :disabled="resultsFetchState !== 'idle'"
            @click="handlePrevious"
          />
          <DsfrButton
            size="lg"
            class="brand-form-actions__button"
            :label="isLastQuestion ? 'Terminer' : 'Suivant'"
            :icon="{ name: 'ri:arrow-right-line', ssr: true }"
            icon-right
            :disabled="!hasAnswer || resultsFetchState !== 'idle'"
            @click="handleNext"
          />
        </div>
      </template>
    </template>
  </div>
</template>

<style scoped lang="scss">
.brand-form-actions {
  display: flex;

  &.brand-form-actions__align-end {
    justify-content: flex-end;
  }

  .brand-form-actions__button {
    flex-basis: 100%;

    @media (min-width: 36em) {
      flex-basis: calc(50% - 1rem);
    }
  }
}

//.fr-form-group {
//   padding: .5rem .25rem;
//   height: max(20em, 36vh);
//   overflow-y: auto;
//   overflow-x: hidden;
// }

.state-panel {
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  min-height: 10em;
}

.loading-indicator {
  color: var(--text-mention-grey);
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: .5rem;
}

.loading-indicator .fr-icon {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}
</style>
