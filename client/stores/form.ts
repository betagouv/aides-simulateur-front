// client/stores/form.ts
interface FormChoice {
  id: string
  title: string
}

//TODO: refacto : SurveyQuestion (validator)
interface FormQuestion {
  id: string
  title: string
  type: 'radio' | 'checkbox' | 'number' | 'date'
  choices?: FormChoice[]
  nextQuestion?: Array<{
    condition: string
    question: string
  }>
}

//TODO: refacto : SurveyStep
interface FormCategory {
  id: string
  title: string
  questions: FormQuestion[]
}

//TODO: refacto : SurveySchema
interface FormDefinition {
  id: string
  title: string
  description: string
  categories: FormCategory[]
}

export const useFormStore = defineStore('form', () => {
  // Form answers storage
  const answers = ref<Record<string, any>>({})

  // Current question being displayed
  const currentQuestionId = ref<string | null>(null)

  // Current category being displayed
  const currentCategoryId = ref<string | null>(null)

  // Form definition loaded from JSON
  const formDefinition = ref<FormDefinition | null>(null)

  // Function to set an answer
  function setAnswer(questionId: string, value: any) {
    answers.value[questionId] = value
  }

  // Load form definition from a JSON file
  async function loadFormDefinition(formId: string) {
    try {
      // You might need to adjust the path based on your project structure
      const response = await fetch(`/forms/${formId}.json`)
      const data = await response.json()
      formDefinition.value = data

      // Initialize with the first category and question if available
      if (data.categories && data.categories.length > 0) {
        currentCategoryId.value = data.categories[0].id

        if (data.categories[0].questions && data.categories[0].questions.length > 0) {
          currentQuestionId.value = data.categories[0].questions[0].id
        }
      }
    } catch (error) {
      console.error('Error loading form definition:', error)
    }
  }

  // Get the current category
  const currentCategory = computed(() => {
    if (!formDefinition.value || !currentCategoryId.value) return null

    return formDefinition.value.categories.find(
      (category) => category.id === currentCategoryId.value
    )
  })

  const nextCategory = computed(() => {
    if (!formDefinition.value || !currentCategoryId.value) return null

    // Find the index of the current category
    const currentCategoryIndex = formDefinition.value.categories.findIndex(
      (category) => category.id === currentCategoryId.value
    )

    // Check if there is a next category
    if (currentCategoryIndex < formDefinition.value.categories.length - 1) {
      return formDefinition.value.categories[currentCategoryIndex + 1]
    }

    // No next category available
    return null
  })

  // Get the current question
  const currentQuestion = computed(() => {
    if (!currentCategory.value || !currentQuestionId.value) return null

    return currentCategory.value.questions.find(
      (question) => question.id === currentQuestionId.value
    )
  })

  // Evaluate a condition string
  function evaluateCondition(conditionStr: string): boolean {
    if (!conditionStr) return true

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
      const conditionWithValues = conditionStr.replace(/([a-zA-Z_][a-zA-Z0-9_-]*)/g, (match) => {
        const normalized = match.replace(/-/g, '_')
        return normalized in context ? context[normalized].toString() : 'undefined'
      })

      // Evaluate the condition
      // NOTE: Using eval is typically not recommended for security reasons
      // In a production app, consider using a proper expression evaluator
      return eval(conditionWithValues)
    } catch (error) {
      console.error('Error evaluating condition:', conditionStr, error)
      return false
    }
  }

  // Determine the next question based on answers
  function getNextQuestionId(): string | null {
    if (!currentQuestion.value) return null

    const question = currentQuestion.value

    // If there's a nextQuestion array with conditions
    if (question.nextQuestion && question.nextQuestion.length > 0) {
      // Find the first matching condition
      for (const next of question.nextQuestion) {
        if (evaluateCondition(next.condition)) {
          return next.question
        }
      }
    }

    // If no conditions matched, find the next question in the current category
    const currentQuestionIndex = currentCategory.value.questions.findIndex(
      (q: any) => q.id === currentQuestionId.value
    )

    if (currentQuestionIndex < currentCategory.value.questions.length - 1) {
      return currentCategory.value.questions[currentQuestionIndex + 1].id
    }

    // If there are no more questions in this category, move to the next category
    const currentCategoryIndex = formDefinition.value.categories.findIndex(
      (cat: any) => cat.id === currentCategoryId.value
    )

    if (currentCategoryIndex < formDefinition.value.categories.length - 1) {
      const nextCategory = formDefinition.value.categories[currentCategoryIndex + 1]
      if (nextCategory.questions && nextCategory.questions.length > 0) {
        currentCategoryId.value = nextCategory.id
        return nextCategory.questions[0].id
      }
    }

    // No more questions
    return null
  }

  // Go to the next question
  function goToNextQuestion() {
    const nextQuestionId = getNextQuestionId()
    if (nextQuestionId) {
      currentQuestionId.value = nextQuestionId
      return true
    }
    return false
  }

  // Go to the previous question (simplified navigation)
  function goToPreviousQuestion() {
    const currentQuestionIndex = currentCategory.value.questions.findIndex(
      (q: any) => q.id === currentQuestionId.value
    )

    if (currentQuestionIndex > 0) {
      currentQuestionId.value = currentCategory.value.questions[currentQuestionIndex - 1].id
      return true
    }

    // If we're at the first question of a category, go to the previous category
    const currentCategoryIndex = formDefinition.value.categories.findIndex(
      (cat: any) => cat.id === currentCategoryId.value
    )

    if (currentCategoryIndex > 0) {
      const prevCategory = formDefinition.value.categories[currentCategoryIndex - 1]
      currentCategoryId.value = prevCategory.id

      if (prevCategory.questions && prevCategory.questions.length > 0) {
        currentQuestionId.value = prevCategory.questions[prevCategory.questions.length - 1].id
        return true
      }
    }

    return false
  }

  // Reset the form
  function resetForm() {
    answers.value = {}

    // Reset to first category/question
    if (formDefinition.value && formDefinition.value.categories.length > 0) {
      currentCategoryId.value = formDefinition.value.categories[0].id

      if (formDefinition.value.categories[0].questions.length > 0) {
        currentQuestionId.value = formDefinition.value.categories[0].questions[0].id
      }
    }
  }

  // Calculate progress
  const progress = computed(() => {
    if (!formDefinition.value) return 0

    // Count all questions
    const totalQuestions = formDefinition.value.categories.reduce(
      (count: number, category: any) => count + (category.questions ? category.questions.length : 0),
      0
    )

    // Count completed questions (simplified approach - not accounting for skipped)
    const answeredQuestions = Object.keys(answers.value).length

    return Math.min(Math.round((answeredQuestions / totalQuestions) * 100), 100)
  })

  // Check if we're at the last question
  const isLastQuestion = computed(() => {
    return getNextQuestionId() === null
  })


  // Current step tracking (category index + 1)
const currentCategoryIndex = computed(() => {
  if (!formDefinition.value || !currentCategory.value) { return 1 }
  const index = formDefinition.value.categories.findIndex(cat => cat.id === currentCategory.value?.id)
  return index + 1
})

const totalCategoriesNumber = computed(() => {
  if (!formDefinition.value) { return 1 }
  return formDefinition.value.categories.length
})

  return {
    answers,
    currentQuestionId,
    currentCategoryId,
    formDefinition,
    currentCategory,
    nextCategory,
    currentQuestion,
    progress,
    isLastQuestion,
    //For Interface display
    currentCategoryIndex,
    totalCategoriesNumber,
    setAnswer,
    loadFormDefinition,
    goToNextQuestion,
    goToPreviousQuestion,
    resetForm
  }
})
