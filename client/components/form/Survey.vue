<script lang="ts" setup>
import type { SurveyQuestion } from '@/stores/survey'
import BooleanQuestion from './BooleanQuestion.vue'
import DateQuestion from './DateQuestion.vue'
import MultiSelectQuestion from './MultiSelectQuestion.vue'
import NumberQuestion from './NumberQuestion.vue'
import RadioButtonQuestion from './RadioButtonQuestion.vue'
import TextQuestion from './TextQuestion.vue'

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
  currentStep,
  nextCategory,
  surveySchema,
  answers,
  progress,
  isLastQuestion,
  currentStepIndex,
  totalCategoriesNumber,
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
  if (!currentQuestion.value) { return false }

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
  console.error('Loading form definition for:', simulateurId)
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
  console.error('----- setAnswer', questionId, value)
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

function submitForm () {
  // Process the final form data from the answers store
  console.error('Form submitted with answers:', answers.value)
  // You might want to send this data to an API, or calculate results
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
</script>

<template>
  <div class="fr-col-12 fr-col-offset-md-1 fr-col-md-10 fr-col-offset-lg-2 fr-col-lg-8">
    <!-- Écran de chargement -->
    <div
      v-if="isLoading"
      class="fr-py-5w fr-text--center"
    >
      <p>Chargement du formulaire...</p>
    </div>

    <!-- Écran de choix (reprendre ou recommencer) -->
    <div
      v-else-if="showChoiceScreen"
      class="fr-container fr-py-4w"
    >
      <div class="fr-grid-row fr-grid-row--center">
        <div class="fr-col-12 fr-col-md-10 fr-col-lg-8">
          <div class="fr-card fr-card--shadow fr-p-3w">
            <h2 class="fr-h4">
              Vous avez un formulaire en cours
            </h2>
            <p class="fr-text--bold">
              Progression : {{ progress }}%
            </p>
            <p>Souhaitez-vous reprendre votre formulaire là où vous vous êtes arrêté ou recommencer à zéro ?</p>

            <div class="fr-btns-group fr-btns-group--inline-lg fr-mt-2w">
              <DsfrButton
                label="Reprendre"
                icon="ri-play-line"
                @click="resumeForm"
              />
              <DsfrButton
                label="Recommencer"
                secondary
                icon="ri-restart-line"
                @click="restartForm"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Formulaire -->
    <template v-else>
      <h1 class="fr-h3">
        Votre simulation « {{ surveySchema?.title }} »
      </h1>

      <div class="fr-stepper">
        <h2 class="fr-stepper__title">
          {{ currentStep?.title }}
          <span class="fr-stepper__state">
            Étape {{ currentStepIndex }} sur {{ totalCategoriesNumber }}</span>
        </h2>
        <div
          class="fr-stepper__steps"
          :data-fr-current-step="currentStepIndex"
          :data-fr-steps="totalCategoriesNumber"
        />
        <p class="fr-stepper__details">
          <span class="fr-text--bold">Étape suivante :</span>
          {{ nextCategory?.title }}
        </p>
      </div>

      <div
        v-if="surveySchema && currentQuestion"
        class="simulator-form-container"
      >
        <!-- Current Question -->
        <div class="fr-form-group">
          <h2 class="fr-h5">
            {{ currentQuestion?.title }}
          </h2>
          <p>{{ currentQuestion?.description }}</p>
          <DsfrButton
            v-if="currentQuestion?.notion"
            :label="currentQuestion?.notion.buttonLabel"
            icon="ri-information-line"
            secondary
            icon-right
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

        <!-- Navigation buttons -->
        <div class="fr-btns-group fr-btns-group--inline-reverse fr-mt-5w">
          <DsfrButton
            :label="isLastQuestion ? 'Terminer' : 'Suivant'"
            icon="ri-arrow-right-line"
            icon-right
            :disabled="!hasAnswer"
            @click="handleNext"
          />
          <DsfrButton
            label="Précédent"
            secondary
            @click="handlePrevious"
          />
        </div>
      </div>
      <div
        v-else
        class="fr-py-5w fr-text--center"
      >
        <p>Erreur lors du chargement du formulaire</p>
      </div>
    </template>
  </div>
  <div
    v-else
    class="fr-py-5w fr-text--center"
  >
    <p>{{ isLoading ? 'Chargement du formulaire...' : 'Erreur lors du chargement du formulaire' }}</p>
  </div>
</template>

<style scoped lang="scss">
.simulator-form-container {
  background-color: white;
  padding: 2rem;
  border-radius: 4px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  margin-top: 1.5rem;
}
</style>
