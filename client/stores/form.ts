// client/stores/form.ts
interface SurveyChoice {
  id: string
  title: string
}

interface SurveyQuestion {
  id: string
  title: string
  type: 'radio' | 'checkbox' | 'number' | 'date'
  choices?: SurveyChoice[]
  bypassToQuestion?: Array<{
    condition: string
    question: string
  }>
}

// TODO: refacto : SurveyStep
interface SurveyStep {
  id: string
  title: string
  questions: SurveyQuestion[]
}

interface SurveySchema {
  id: string
  title: string
  description: string
  steps: SurveyStep[]
}

export const useFormStore = defineStore('form', () => {
  // Form answers storage
  const answers = ref<Record<string, any>>({})

  // Current question being displayed
  const currentQuestionId = ref<string | null>(null)

  // Current category being displayed
  const currentStepId = ref<string | null>(null)

  // Form definition loaded from JSON
  const surveySchema = ref<SurveySchema | null>(null)

  // Function to set an answer
  function setAnswer (questionId: string, value: any) {
    answers.value[questionId] = value
  }

  // Load form definition from a JSON file
  async function loadSurveySchema (formId: string) {
    try {
      // You might need to adjust the path based on your project structure
      const response = await fetch(`/forms/${formId}.json`)
      const data = await response.json()
      surveySchema.value = data

      // Initialize with the first category and question if available
      if (data.steps && data.steps.length > 0) {
        currentStepId.value = data.steps[0].id

        if (data.steps[0].questions && data.steps[0].questions.length > 0) {
          currentQuestionId.value = data.steps[0].questions[0].id
        }
      }
    }
    catch (error) {
      console.error('Error loading form definition:', error)
    }
  }

  // Get the current category
  const currentStep = computed(() => {
    if (!surveySchema.value || !currentStepId.value) { return null }

    return surveySchema.value.steps.find(
      category => category.id === currentStepId.value
    )
  })

  const nextCategory = computed(() => {
    if (!surveySchema.value || !currentStepId.value) { return null }

    // Find the index of the current category
    const currentStepIndex = surveySchema.value.steps.findIndex(
      category => category.id === currentStepId.value
    )

    // Check if there is a next category
    if (currentStepIndex < surveySchema.value.steps.length - 1) {
      return surveySchema.value.steps[currentStepIndex + 1]
    }

    // No next category available
    return null
  })

  // Get the current question
  const currentQuestion = computed(() => {
    if (!currentStep.value || !currentQuestionId.value) { return null }

    return currentStep.value.questions.find(
      question => question.id === currentQuestionId.value
    )
  })

  // Evaluate a condition string
  function evaluateCondition (conditionStr: string): boolean {
    if (!conditionStr) { return true }

    // Create a context with answers
    const context: Record<string, any> = {}

    // For each answer, add a variable to the context
    Object.entries(answers.value).forEach(([key, value]) => {
      context[key.replace(/-/g, '_')] = value
    })

    // Add choice IDs as boolean variables
    Object.entries(answers.value).forEach(([questionId, choiceId]) => {
      if (typeof choiceId === 'string') {
        context[choiceId.replace(/-/g, '_')] = true
      }
    })

    try {
      // Replace question IDs with values in the condition
      const conditionWithValues = conditionStr.replace(/([a-z_][\w-]*)/gi, (match) => {
        const normalized = match.replace(/-/g, '_')
        return normalized in context ? context[normalized].toString() : 'undefined'
      })

      // Evaluate the condition
      // NOTE: Using eval is typically not recommended for security reasons
      // In a production app, consider using a proper expression evaluator
      return eval(conditionWithValues)
    }
    catch (error) {
      console.error('Error evaluating condition:', conditionStr, error)
      return false
    }
  }

  // Determine the next question based on answers
  function getBypassToQuestionId (): string | null {
    if (!currentQuestion.value) { return null }

    const question = currentQuestion.value

    // If there's a bypassToQuestion array with conditions
    if (question.bypassToQuestion && question.bypassToQuestion.length > 0) {
      // Find the first matching condition
      for (const next of question.bypassToQuestion) {
        if (evaluateCondition(next.condition)) {
          return next.question
        }
      }
    }

    // If no conditions matched, find the next question in the current category
    const currentQuestionIndex = currentStep.value.questions.findIndex(
      (q: any) => q.id === currentQuestionId.value
    )

    if (currentQuestionIndex < currentStep.value.questions.length - 1) {
      return currentStep.value.questions[currentQuestionIndex + 1].id
    }

    // If there are no more questions in this category, move to the next category
    const currentStepIndex = surveySchema.value.steps.findIndex(
      (cat: any) => cat.id === currentStepId.value
    )

    if (currentStepIndex < surveySchema.value.steps.length - 1) {
      const nextCategory = surveySchema.value.steps[currentStepIndex + 1]
      if (nextCategory.questions && nextCategory.questions.length > 0) {
        currentStepId.value = nextCategory.id
        return nextCategory.questions[0].id
      }
    }

    // No more questions
    return null
  }

  // Go to the next question
  function goToNextQuestion () {
    const bypassToQuestionId = getBypassToQuestionId()
    if (bypassToQuestionId) {
      currentQuestionId.value = bypassToQuestionId
      return true
    }
    return false
  }

  // Go to the previous question (simplified navigation)
  function goToPreviousQuestion () {
    const currentQuestionIndex = currentStep.value.questions.findIndex(
      (q: any) => q.id === currentQuestionId.value
    )

    if (currentQuestionIndex > 0) {
      currentQuestionId.value = currentStep.value.questions[currentQuestionIndex - 1].id
      return true
    }

    // If we're at the first question of a category, go to the previous category
    const currentStepIndex = surveySchema.value.steps.findIndex(
      (cat: any) => cat.id === currentStepId.value
    )

    if (currentStepIndex > 0) {
      const prevCategory = surveySchema.value.steps[currentStepIndex - 1]
      currentStepId.value = prevCategory.id

      if (prevCategory.questions && prevCategory.questions.length > 0) {
        currentQuestionId.value = prevCategory.questions[prevCategory.questions.length - 1].id
        return true
      }
    }

    return false
  }

  // Reset the form
  function resetForm () {
    answers.value = {}

    // Reset to first category/question
    if (surveySchema.value && surveySchema.value.steps.length > 0) {
      currentStepId.value = surveySchema.value.steps[0].id

      if (surveySchema.value.steps[0].questions.length > 0) {
        currentQuestionId.value = surveySchema.value.steps[0].questions[0].id
      }
    }
  }

  // Calculate progress
  const progress = computed(() => {
    if (!surveySchema.value) { return 0 }

    // Count all questions
    const totalQuestions = surveySchema.value.steps.reduce(
      (count: number, category: any) => count + (category.questions ? category.questions.length : 0),
      0
    )

    // Count completed questions (simplified approach - not accounting for skipped)
    const answeredQuestions = Object.keys(answers.value).length

    return Math.min(Math.round((answeredQuestions / totalQuestions) * 100), 100)
  })

  // Check if we're at the last question
  const isLastQuestion = computed(() => {
    return getBypassToQuestionId() === null
  })

  // Current step tracking (category index + 1)
  const currentStepIndex = computed(() => {
    if (!surveySchema.value || !currentStep.value) { return 1 }
    const index = surveySchema.value.steps.findIndex(cat => cat.id === currentStep.value?.id)
    return index + 1
  })

  const totalCategoriesNumber = computed(() => {
    if (!surveySchema.value) { return 1 }
    return surveySchema.value.steps.length
  })

  return {
    answers,
    currentQuestionId,
    currentStepId,
    surveySchema,
    currentStep,
    nextCategory,
    currentQuestion,
    progress,
    isLastQuestion,
    // For Interface display
    currentStepIndex,
    totalCategoriesNumber,
    setAnswer,
    loadSurveySchema,
    goToNextQuestion,
    goToPreviousQuestion,
    resetForm
  }
}, {
  persist: true
})
