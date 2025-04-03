<script lang="ts" setup>
import { onKeyDown } from '@vueuse/core'

const props = defineProps<{
  simulateurId: string
}>()

const emit = defineEmits<{
  (e: 'complete'): void
}>()
const simulateurId = props.simulateurId
const { useHasValidAnswer } = useFormValidation()

// Local state
const questionContainer = ref<HTMLElement | null>(null)

const surveysStore = useSurveysStore()

// Get simulateur-specific state
const currentQuestion = computed(() => surveysStore.getCurrentQuestion(simulateurId))
const surveySchema = computed(() => surveysStore.getSchema(simulateurId))
const isLastQuestion = computed(() => surveysStore.isLastQuestion(simulateurId))
const currentStepIndex = computed(() => surveysStore.getCurrentStepIndex(simulateurId))
const answers = computed(() => surveysStore.getAnswers(simulateurId))

const steps = computed(() => {
  return surveySchema.value?.steps
    .map((step) => {
      return step.title
    })
    .filter(Boolean) || []
})

// Get autocomplete function for current question
const autocompleteFn = computed(() => {
  if (currentQuestion.value?.autocompleteFunction) {
    return autocompleteFunctions[currentQuestion.value.autocompleteFunction]
  }
  return undefined
})

// Check if the current question has been answered
const hasAnswer = useHasValidAnswer(currentQuestion, computed(() => answers.value))

// Heading levels based on iframe context
const { isIframe } = useIframeDisplay()
const surveyH2 = computed(() => isIframe.value ? 'h2' : 'h3')

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

// Handle updates from question components
function handleQuestionUpdate (questionId: string, value: any) {
  // Pass update to parent component
  surveysStore.setAnswer(simulateurId, questionId, value)
}

// Navigate to next question or submit form
function handleNext () {
  if (isLastQuestion.value) {
    // Submit form
    emit('complete')
  }
  else {
    surveysStore.goToNextQuestion(simulateurId)
    focusRenderedQuestion()
  }
}

// If Enter is pressed and there's an answer, go to next question
onKeyDown('Enter', () => {
  if (hasAnswer.value) {
    handleNext()
  }
}, { target: questionContainer })

// Navigate to previous question
function handlePrevious () {
  surveysStore.goToPreviousQuestion(simulateurId)
  focusRenderedQuestion()
}

onMounted(() => {
  focusRenderedQuestion()
})
</script>

<template>
  <div>
    <DsfrStepper
      v-if="currentStepIndex"
      :steps="steps"
      :current-step="currentStepIndex"
    />
    <div
      v-if="surveySchema && currentQuestion"
      class="form-container fr-card fr-p-3w"
    >
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
          <div
            ref="questionContainer"
            class="question-actual-container"
          >
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
              :autocomplete-fn="autocompleteFn"
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
        @click="handlePrevious"
      />
      <DsfrButton
        size="lg"
        class="brand-form-actions__button"
        :label="isLastQuestion ? 'Terminer' : 'Suivant'"
        :icon="{ name: 'ri:arrow-right-line', ssr: true }"
        icon-right
        :disabled="!hasAnswer"
        @click="handleNext"
      />
    </div>
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
</style>
