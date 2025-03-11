<script lang="ts" setup>
const props = defineProps<{
  simulateurId: string
  autocompleteFunctions?: Record<string, (query: string) => Promise<any[]>>
}>()

const formStore = useFormStore()
const isLoading = ref(true)
const simulateurId = props.simulateurId

// État pour afficher ou non l'écran de choix
const showChoiceScreen = ref(false)

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

onMounted(async () => {
  try {
    await loadSurveySchema(simulateurId)
    isLoading.value = false

    // Afficher l'écran de choix si un formulaire est en cours
    showChoiceScreen.value = hasInProgressForm.value

    // Add event listener for Enter key
    window.addEventListener('keydown', handleKeyDown)
  }
  catch (error) {
    console.error('Error loading form:', error)
    isLoading.value = false
  }
})

onUnmounted(() => {
  // Remove event listener when component is unmounted
  window.removeEventListener('keydown', handleKeyDown)
})

// Handle Enter key press
function handleKeyDown (event: KeyboardEvent) {
  if (event.key === 'Enter' && hasAnswer.value) {
    // If Enter is pressed and there's an answer, go to next question
    handleNext()
  }
}

// Handle updates from question components
function handleQuestionUpdate (questionId: string, value: any) {
  setAnswer(questionId, value)
}

// Navigation functions
function handleNext () {
  if (isLastQuestion.value) {
    // Handle form completion, maybe redirect to results
    submitForm()
  }
  else {
    goToNextQuestion()
  }
}

function handlePrevious () {
  goToPreviousQuestion()
}

async function submitForm () {
  // Process the final form data from the answers store
  // eslint-disable-next-line no-console
  console.log('Form submitted with answers:', answers.value)

  // Sending this data to a web API to calculate a set of 'aides'
  try {
    const request: OpenFiscaCalculationRequest = buildRequest(answers.value)
    const results = await fetchOpenFiscaFranceCalculation(request)
    // eslint-disable-next-line no-console
    console.debug(results)

    // Track form submission in Matomo
    if (typeof window !== 'undefined' && (window as any)._paq) {
      (window as any)._paq.push(['trackEvent', 'Survey', 'Submit', simulateurId])
    }

    // Store form data and results
    try {
      const response = await $fetch('/api/store-form-data', {
        method: 'POST',
        body: {
          simulateurId,
          answers: answers.value,
          results,
        },
      })

      if (response.success) {
        // eslint-disable-next-line no-console
        console.info('Form data stored successfully:', response.filename)
      }
      else {
        console.error('Failed to store form data:', response.error)
      }
    }
    catch (storageError) {
      console.error('Error storing form data:', storageError)
    }
  }
  catch (error) {
    // TODO Handle the error more professionnally and display a message to the user :)
    console.error('Erreur inattendue lors de la soumission du formulaire et de l\'appel au calcul :', error)
  }
}

// Fonctions pour le choix de l'utilisateur
function resumeForm () {
  goToLastAnsweredQuestion()
  showChoiceScreen.value = false
}

function restartForm () {
  resetForm()
  showChoiceScreen.value = false
}

const { isIframe } = useIframeDisplay()
const surveyTitleTag = computed(() => isIframe.value ? 'h1' : 'h2')
const surveyQuestionTitleTag = computed(() => isIframe.value ? 'h2' : 'h3')
</script>

<template>
  <div>
    <!-- Écran de choix (reprendre ou recommencer) -->
    <div
      v-if="showChoiceScreen"
      class="fr-p-4w"
    >
      <div class="fr-card fr-card--shadow fr-p-3w">
        <h2 class="fr-h4">
          Vous avez un formulaire en cours
        </h2>
        <p class="fr-text--bold">
          Progression : {{ progress }}%
        </p>
        <p>Souhaitez-vous reprendre votre formulaire là où vous vous êtes arrêté ou recommencer à zéro ?</p>
        <DsfrButtonGroup
          inline-layout-when="md"
          :buttons="[
            {
              label: 'Reprendre',
              icon: { name: 'ri:play-line', ssr: true },
              onClick: resumeForm,
            },
            {
              label: 'Recommencer',
              secondary: true,
              icon: { name: 'ri:restart-line', ssr: true },
              onClick: restartForm,
            },
          ]"
        />
      </div>
    </div>

    <!-- Formulaire -->
    <template v-else>
      <component
        :is="surveyTitleTag"
        class="fr-h3"
      >
        Votre simulation « {{ surveySchema?.title }} »
      </component>

      <DsfrStepper
        :steps="surveySchema?.steps.map(step => step.title).filter(Boolean) || []"
        :current-step="currentStepIndex"
      />

      <div
        v-if="surveySchema && currentQuestion"
        class="fr-card fr-card--shadow fr-p-3w"
      >
        <!-- Current Question -->
        <div class="fr-form-group">
          <hgroup>
            <component
              :is="surveyQuestionTitleTag"
              class="fr-h5"
            >
              {{ currentQuestion?.title }}
            </component>
            <p
              v-if="currentQuestion?.description"
            >
              {{ currentQuestion?.description }}
            </p>
          </hgroup>
          <DsfrButton
            v-if="currentQuestion?.notion"
            :label="currentQuestion?.notion.buttonLabel"
            icon="ri-information-line"
            secondary
            icon-right
            class="fr-mb-2w"
            @click="() => navigateTo(`/simulateurs/${simulateurId}/${currentQuestion?.notion.id}`)"
          />

          <!-- Question component based on type -->
          <template v-if="currentQuestion">
            <RadioButtonQuestion
              v-if="currentQuestion.type === 'radio'"
              :question="currentQuestion"
              :model-value="answers[currentQuestion.id]"
              @update:model-value="value => currentQuestion && handleQuestionUpdate(currentQuestion.id, value)"
            />

            <BooleanQuestion
              v-else-if="currentQuestion.type === 'boolean'"
              :question="currentQuestion"
              :model-value="answers[currentQuestion.id]"
              @update:model-value="value => currentQuestion && handleQuestionUpdate(currentQuestion.id, value)"
            />

            <MultiSelectQuestion
              v-else-if="currentQuestion.type === 'checkbox'"
              :question="currentQuestion"
              :model-value="answers[currentQuestion.id]"
              @update:model-value="value => currentQuestion && handleQuestionUpdate(currentQuestion.id, value)"
            />

            <NumberQuestion
              v-else-if="currentQuestion.type === 'number'"
              :question="currentQuestion"
              :model-value="answers[currentQuestion.id]"
              @update:model-value="value => currentQuestion && handleQuestionUpdate(currentQuestion.id, value)"
            />

            <DateQuestion
              v-else-if="currentQuestion.type === 'date'"
              :question="currentQuestion"
              :model-value="answers[currentQuestion.id]"
              @update:model-value="value => currentQuestion && handleQuestionUpdate(currentQuestion.id, value)"
            />

            <TextQuestion
              v-else-if="currentQuestion.type === 'text'"
              :question="currentQuestion"
              :model-value="answers[currentQuestion.id]"
              :autocomplete-fn="getAutocompleteFn"
              @update:model-value="value => currentQuestion && handleQuestionUpdate(currentQuestion.id, value)"
            />
          </template>
        </div>

        <DsfrButtonGroup
          class="fr-mt-3w"
          align="right"
          inline-layout-when="md"
          :buttons="[
            {
              label: 'Précédent',
              secondary: true,
              icon: { name: 'ri-arrow-left-line', ssr: true },
              onClick: handlePrevious,
            },
            {
              label: isLastQuestion ? 'Terminer' : 'Suivant',
              icon: { name: 'ri-arrow-right-line', ssr: true },
              iconRight: true,
              disabled: !hasAnswer,
              onClick: handleNext,
            },
          ]"
        />
      </div>
      <div
        v-else
        class="fr-py-5w fr-text--center"
      >
        <p>Erreur lors du chargement du formulaire</p>
      </div>
    </template>
  </div>
</template>
