<script lang="ts" setup>
import {
  BooleanQuestion,
  DateQuestion,
  MultiSelectQuestion,
  NumberQuestion,
  RadioButtonQuestion,
  TextQuestion,
} from '#components'
import { onKeyDown } from '@vueuse/core'

const props = defineProps<{
  simulateurId: string
}>()

const simulateurId = toRef(() => props.simulateurId)

const surveysStore = useSurveysStore()

// Get simulateur-specific state
const currentQuestion = computed(() => surveysStore.getCurrentQuestion(simulateurId.value))
const surveySchema = computed(() => surveysStore.getSchema(simulateurId.value))
const isLastQuestion = computed(() => surveysStore.isLastQuestion(simulateurId.value))
const areAllRequiredQuestionsAnswered = computed(() => surveysStore.areAllRequiredQuestionsAnswered(simulateurId.value))
const currentStepIndex = computed(() => surveysStore.getCurrentStepIndex(simulateurId.value))
const answers = computed(() => surveysStore.getAnswers(simulateurId.value))

const stepTitles = computed(() => {
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

// Get autocomplete configuration for current question
const autocompleteConfig = computed(() => {
  if (currentQuestion.value?.autocompleteFunction) {
    // Merge default config with any custom config from question
    return {
      ...autocompleteConfigs[currentQuestion.value.autocompleteFunction],
      ...currentQuestion.value.autocompleteConfig || {},
    }
  }
  return undefined
})

// Check if the current question has been answered
const hasValidAnswer = computed(() => {
  if (!currentQuestion.value) {
    return false
  }
  return isAnswerValid(currentQuestion.value, answers.value[currentQuestion.value.id])
})

// Heading levels based on iframe context
const { isIframe } = useIframeDisplay()
const surveyH2 = computed(() => isIframe.value ? 'h2' : 'h3')

// Focus on the question container after navigation
const questionContainer = ref<HTMLElement | null>(null)
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

onMounted(() => {
  focusRenderedQuestion()
})

// Navigate to next question or submit form
function handleNext () {
  const wentToNext = surveysStore.goToNextQuestion(simulateurId.value)
  if (wentToNext) {
    focusRenderedQuestion()
  }
}

// If Enter is pressed and there's an answer, go to next question
// onKeyDown('Enter', () => {
//   if (hasValidAnswer.value) {
//     handleNext()
//   }
// }, { target: questionContainer })

// Navigate to previous question
function handlePrevious () {
  const wentToPrev = surveysStore.goToPreviousQuestion(simulateurId.value)
  if (wentToPrev) {
    focusRenderedQuestion()
  }
  else {
    surveysStore.setShowWelcomeScreen(simulateurId.value, true)
  }
}

const questionModel = customRef((track, trigger) => {
  return {
    get () {
      track()
      if (!currentQuestion.value) {
        return undefined
      }
      return surveysStore.getAnswer(simulateurId.value, currentQuestion.value?.id)
    },
    set (value) {
      if (!currentQuestion.value) {
        return
      }
      surveysStore.setAnswer(simulateurId.value, currentQuestion.value?.id, value)
      trigger()
    }
  }
})

const questionComponent = computed(() => {
  if (!currentQuestion.value) {
    return undefined
  }
  return {
    radio: RadioButtonQuestion,
    boolean: BooleanQuestion,
    checkbox: MultiSelectQuestion,
    number: NumberQuestion,
    date: DateQuestion,
    text: TextQuestion,
  }[currentQuestion.value.type] || TextQuestion
})

function handleComplete () {
  surveysStore.tryComplete(simulateurId.value)
}
</script>

<template>
  <div>
    <DsfrStepper
      v-if="currentStepIndex"
      :steps="stepTitles"
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
            :id="`question-${currentQuestion.id}`"
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
          <component
            :is="questionComponent"
            ref="questionContainer"
            :key="currentQuestion.id"
            v-model="questionModel"
            :question="currentQuestion"
            :autocomplete-config="autocompleteConfig"
            :autocomplete-fn="autocompleteFn"
          />
        </template>
      </div>
    </div>
    <div class="fr-btns-group fr-btns-group--lg fr-mt-4w brand-form-actions brand-form-actions__align-end">
      <DsfrButton
        class="brand-form-actions__button"
        label="Récapitulatif"
        secondary
        size="lg"
        :icon="{ name: 'ri:menu-line', ssr: true }"
        @click="() => navigateTo(`/simulateurs/${simulateurId}/recapitulatif`)"
      />
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
        label="Suivant"
        :secondary="areAllRequiredQuestionsAnswered"
        :icon="{ name: 'ri:arrow-right-line', ssr: true }"
        icon-right
        :disabled="isLastQuestion || !hasValidAnswer"
        @click="handleNext"
      />
      <DsfrButton
        v-if="areAllRequiredQuestionsAnswered"
        size="lg"
        class="brand-form-actions__button"
        label="Terminer"
        :icon="{ name: 'ri:arrow-right-line', ssr: true }"
        icon-right
        @click="handleComplete"
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
      flex-basis: calc(25% - 1rem);
    }
  }
}
</style>
