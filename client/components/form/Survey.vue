<script lang="ts" setup>
import { onKeyDown } from '@vueuse/core'

const props = defineProps<{
  simulateurId: string
  autocompleteFunctions?: Record<string, (query: string) => Promise<any[]>>
}>()

const formStore = useFormStore()
const isLoading = ref(true)

const resultsFetchState = ref<'idle' | 'loading' | 'loaded' | 'error'>('idle')

const simulateurId = props.simulateurId
// État pour afficher ou non l'écran de choix
const showChoiceScreen = ref(false)

// Etat pour afficher ou non l'écran de bienvenue
const showWelcomeScreen = ref(false)

// Get iframe display information
const { isIframe, getIframeSource } = useIframeDisplay()

// Use storeToRefs to maintain reactivity
const {
  currentQuestion,
  surveySchema,
  answers,
  progress,
  isLastQuestion,
  currentStepIndex,
  hasInProgressForm,
} = storeToRefs(formStore)

const {
  loadSurveySchema,
  goToNextQuestion,
  goToPreviousQuestion,
  goToLastAnsweredQuestion,
  resetForm,
  setAnswer
} = formStore

// Récupère la fonction d'autocomplétion pour la question courante
const getAutocompleteFn = computed(() => {
  if (currentQuestion.value?.autocompleteFunction && props.autocompleteFunctions) {
    return props.autocompleteFunctions[currentQuestion.value.autocompleteFunction]
  }
  return undefined
})

// Check if the current question has been answered
const hasAnswer = computed(() => {
  if (!currentQuestion.value) {
    return false
  }

  const questionId = currentQuestion.value.id
  const answer = answers.value[questionId]

  // Different validation based on question type
  switch (currentQuestion.value.type) {
    case 'radio':
    case 'date':
      // For radio and date, any non-empty value is valid
      return !!answer
    case 'boolean':
      // For boolean, both true and false are valid answers
      return answer === true || answer === false
    case 'checkbox':
      // For checkbox, the answer should be an array with at least one item
      return Array.isArray(answer) && answer.length > 0
    case 'number':
      // For number, we need to check if it's a number including 0
      return answer === 0 || !!answer
    case 'text':
      // For text, the value should not be empty
      return answer !== undefined && answer !== null && answer !== ''
    default:
      return false
  }
})

// Focus on the question container after navigation
const questionContainer = ref<HTMLElement | null>(null)
function focusRenderedQuestion () {
  nextTick(() => {
    if (questionContainer.value) {
      // Focus the first focusable element inside the question container
      const focusable = questionContainer.value.querySelector('input, button, select, textarea') as HTMLElement | null
      if (focusable) {
        focusable.focus()
      }
    }
  })
}

/**
 * If Enter is pressed while we are within form container
 * and there's an answer, go to next question
 */
onKeyDown('Enter', () => {
  if (hasAnswer.value) {
    handleNext()
  }
}, { target: questionContainer })

onMounted(async () => {
  try {
    await loadSurveySchema(simulateurId)
    isLoading.value = false

    // Resume the form if the query parameter is present
    const route = useRoute()
    const doResume = computed(() => route.query.resume === 'true')
    if (doResume.value) {
      resumeForm()
      route.query.resume = null
    }

    // Afficher l'écran de choix si un formulaire est en cours
    showChoiceScreen.value = hasInProgressForm.value && !doResume.value
    showWelcomeScreen.value = !hasInProgressForm.value && !doResume.value

    // Track form start in Matomo
    if (typeof window !== 'undefined' && (window as any)._paq) {
      const source = isIframe.value ? `iframe@${getIframeSource()}` : 'website'
      const category = `[${simulateurId}][${source}]Survey`
        ; (window as any)._paq.push(['trackEvent', category, 'Start'])
    }
  }
  catch (error) {
    console.error('Error loading form:', error)
    isLoading.value = false
  }
})

function handleStart () {
  showWelcomeScreen.value = false
}

// Handle updates from question components
function handleQuestionUpdate (questionId: string, value: any) {
  setAnswer(questionId, value)
}

// Navigation functions with focus restoration
function handleNext () {
  if (isLastQuestion.value) {
    // Handle form completion, maybe redirect to results
    submitForm()
  }
  else {
    goToNextQuestion()
    focusRenderedQuestion()
  }
}

function handlePrevious () {
  const prevQuestion = goToPreviousQuestion()
  if (prevQuestion === false) {
    // If we are at the first question, show the welcome screen
    showWelcomeScreen.value = true
  }
  focusRenderedQuestion()
}

const resultStore = useResultsStore()

async function submitForm () {
  // Process the final form data from the answers store
  // eslint-disable-next-line no-console
  console.log('Form submitted with answers:', answers.value)

  // TODO : next step (to check with aides-calculatrice-back) = adding
  // 'locapass', 'mobilite-master-1-eligibilite', 'mobilite-parcoursup-eligibilite'
  const questionsToApi: string[] = [
    'locapass-eligibilite',
    'mobilite-master-1',
    'mobilite-parcoursup',
    'aide-personnalisee-logement',
    // 'aide-personnalisee-logement-eligibilite' will be deduced from 'aide-personnalisee-logement' amount
    'garantie-visale-eligibilite',
    'garantie-visale'
  ]

  // Sending the data to a web API to calculate a set of 'aides'
  try {
    resultsFetchState.value = 'loading'
    const request: OpenFiscaCalculationRequest = buildRequest(answers.value, questionsToApi)
    const openfiscaResponse: OpenFiscaCalculationResponse = await fetchOpenFiscaFranceCalculation(request)
    resultsFetchState.value = 'loaded'
    // eslint-disable-next-line no-console
    console.debug('Réponse reçue :')
    // eslint-disable-next-line no-console
    console.debug(openfiscaResponse)

    const results: SimulationResultsAides = extractAidesResults(openfiscaResponse, questionsToApi)
    // eslint-disable-next-line no-console
    console.debug('Résulats de simulation extraits :')
    // eslint-disable-next-line no-console
    console.debug(results)

    if (results) {
      resultStore.setResults(simulateurId, results)
      navigateTo(`/simulateurs/${simulateurId}/resultats#simulateur-title`)
    }
    // Track form submission in Matomo
    if (typeof window !== 'undefined' && (window as any)._paq) {
      const source = isIframe.value ? `iframe@${getIframeSource()}` : 'website'
      const category = `[${simulateurId}][${source}]Survey`
        ; (window as any)._paq.push(['trackEvent', category, 'Submit'])
    }

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
        // eslint-disable-next-line no-console
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
    resultsFetchState.value = 'error'
    // TODO Handle the error more professionnally and display a message to the user :)
    console.error('Erreur inattendue lors de la soumission du formulaire et de l\'appel au calcul :', error)
  }
}

// Fonctions pour le choix de l'utilisateur
function resumeForm () {
  goToLastAnsweredQuestion()
  resultsFetchState.value = 'idle'
  showChoiceScreen.value = false
  showWelcomeScreen.value = false
  // Focus the question after resuming
  focusRenderedQuestion()
}

function restartForm () {
  resetForm()
  resultsFetchState.value = 'idle'
  showWelcomeScreen.value = true
  showChoiceScreen.value = false
  // Focus the question after restarting
  focusRenderedQuestion()
}

/**
 * When this page is displayed within an iframe,
 * we need to adjust the heading levels because the h1 is not exposed within the iframe
 */
const surveyH1 = computed(() => isIframe.value ? 'h1' : 'h2')
const surveyH2 = computed(() => isIframe.value ? 'h2' : 'h3')
// const surveyH3 = computed(() => isIframe.value ? 'h3' : 'h4')
// const surveyH4 = computed(() => isIframe.value ? 'h4' : 'h5')
// const surveyH5 = computed(() => isIframe.value ? 'h5' : 'h6')
// const surveyH6 = computed(() => isIframe.value ? 'h6' : 'h6')
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
          Nous continuons à l'améliorer. Vos retours sont précieux :
          <ul>
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
                to="'https://tally.so/r/w27b9D"
                target="_blank"
                label="le questionnaire de satisfaction"
              />
            </li>
          </ul>
          Merci pour votre aide !
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
        <div class="fr-card fr-card--shadow fr-p-3w">
          <p class="loading-indicator fr-text--xl fr-mt-3w">
            <span
              class="fr-icon-refresh-line fr-icon fr-icon--md fr-mr-2w"
              aria-hidden="true"
            />Chargement du formulaire...
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
          :steps="surveySchema?.steps.map(step => step.title).filter(Boolean) || []"
          :current-step="currentStepIndex"
        />
        <div
          v-if="surveySchema && currentQuestion"
          class="form-container fr-card fr-p-3w"
        >
          <DsfrBadge
            v-if="resultsFetchState !== 'idle'"
            class="survey-fetch-state-badge"
            :type="({
              // idle: 'info',
              loading: 'info',
              loaded: 'success',
              error: 'error',
            }[resultsFetchState] as 'info' | 'success' | 'error')"
            :label="{
              // idle: `progression : ${progress}%`,
              loading: 'Estimation en cours...',
              loaded: 'Estimation terminée',
              error: 'Erreur lors de l\'estimation',
            }[resultsFetchState]"
          />
          <!-- Current Question -->
          <div class="fr-form-group">
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
            :disabled="resultsFetchState === 'loading'"
            @click="handlePrevious"
          />
          <DsfrButton
            size="lg"
            class="brand-form-actions__button"
            :label="isLastQuestion ? 'Terminer' : 'Suivant'"
            :icon="{ name: 'ri:arrow-right-line', ssr: true }"
            icon-right
            :disabled="!hasAnswer || resultsFetchState === 'loading'"
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

.form-container {
  position: relative;
}
.fr-form-group {
  padding: .5rem .25rem;
  height: max(20em, 36vh);
  overflow-y: auto;
  overflow-x: hidden;
}

.survey-fetch-state-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
}

.loading-indicator {
  color: var(--text-mention-grey);
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: .5rem;
  min-height: 10em;
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
