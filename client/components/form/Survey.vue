<script lang="ts" setup>
import type { SurveyQuestion } from '@/stores/survey'
import DateQuestion from './DateQuestion.vue'
import InfoBubble from './InfoBubble.vue'
import MultiSelectQuestion from './MultiSelectQuestion.vue'
import NumberQuestion from './NumberQuestion.vue'
import RadioButtonQuestion from './RadioButtonQuestion.vue'

const props = defineProps<{
  simulateurId: string
}>()

const formStore = useFormStore()
const isLoading = ref(true)
const simulateurId = props.simulateurId

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
} = storeToRefs(formStore)

const {
  loadSurveySchema,
  goToNextQuestion,
  goToPreviousQuestion,
  setAnswer
} = formStore

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
    case 'checkbox':
      // For checkbox, the answer should be an array with at least one item
      return Array.isArray(answer) && answer.length > 0
    case 'number':
      // For number, the value should be a number or a non-empty string that can be converted to number
      return answer !== undefined && answer !== null && answer !== ''
    default:
      return false
  }
})

onMounted(async () => {
  console.log('Loading form definition for:', simulateurId)
  try {
    await loadSurveySchema(simulateurId)
    isLoading.value = false

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
  console.log('----- setAnswer', questionId, value)
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
  console.log('Form submitted with answers:', answers.value)
  // You might want to send this data to an API, or calculate results
}
</script>

<template>
  <!-- Progress indicator -->
  <div class="fr-col-12 fr-col-offset-md-1 fr-col-md-10 fr-col-offset-lg-2 fr-col-lg-8">
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
      v-if="!isLoading && surveySchema && currentQuestion"
      class="simulator-form-container"
    >
      <!-- Current Question -->
      <div class="fr-form-group">
        <h2 class="fr-h5">
          {{ currentQuestion?.title }}
          <InfoBubble
            v-if="currentQuestion?.informationLink"
            :information-link="currentQuestion.informationLink"
            :question-id="currentQuestion.id"
          />
        </h2>
        <p>{{ currentQuestion?.description }}</p>

        <!-- Question component based on type -->
        <template v-if="currentQuestion">
          <RadioButtonQuestion
            v-if="currentQuestion.type === 'radio'"
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
      <p>{{ isLoading ? 'Chargement du formulaire...' : 'Erreur lors du chargement du formulaire' }}</p>
    </div>
  </div>
</template>
