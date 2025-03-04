// client/stores/form.ts
export interface SurveyChoice {
  id: string
  title: string
}

export interface SurveyQuestion {
  id: string
  title: string
  description?: string
  type: 'radio' | 'checkbox' | 'number' | 'date'
  choices?: SurveyChoice[]
  nextQuestion?: string
  bypassToQuestion?: Array<{
    condition: string
    question: string
  }>
}

// TODO: refacto : SurveyStep
export interface SurveyStep {
  id: string
  title: string
  questions: SurveyQuestion[]
}

export interface SurveySchema {
  id: string
  title: string
  description: string
  steps: SurveyStep[]
  triggeredQuestions?: SurveyQuestion[]
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
    // First check if it's a triggered question
    const triggeredQuestion = currentQuestionId.value ? findTriggeredQuestion(currentQuestionId.value) : null
    if (triggeredQuestion) { return triggeredQuestion }

    // If not, look in the current step
    if (!currentStep.value || !currentQuestionId.value) { return null }

    return currentStep.value.questions.find(
      question => question.id === currentQuestionId.value
    )
  })

  // Check if current question is a triggered question
  const isTriggeredQuestion = computed(() => {
    if (!currentQuestionId.value) { return false }
    return !!findTriggeredQuestion(currentQuestionId.value)
  })

  // Find a question by ID across all questions (steps and triggered)
  function findQuestionById (questionId: string): { question: SurveyQuestion | null, stepId: string | null } {
    if (!surveySchema.value) { return { question: null, stepId: null } }

    // First, search in the normal steps
    for (const step of surveySchema.value.steps) {
      const question = step.questions.find(q => q.id === questionId)
      if (question) {
        return { question, stepId: step.id }
      }
    }

    // If not found, check in triggered questions
    if (surveySchema.value.triggeredQuestions) {
      const question = surveySchema.value.triggeredQuestions.find(q => q.id === questionId)
      if (question) {
        return { question, stepId: null } // Triggered questions don't belong to any step
      }
    }

    return { question: null, stepId: null }
  }

  // Find a triggered question by ID
  function findTriggeredQuestion (questionId: string): SurveyQuestion | null {
    if (!surveySchema.value || !surveySchema.value.triggeredQuestions) { return null }

    return surveySchema.value.triggeredQuestions.find(q => q.id === questionId) || null
  }

  // Evaluate a condition string
  function evaluateCondition (conditionStr: string): boolean {
    if (!conditionStr) { return true }

    // Create a context with answers
    const getAnswerValue = (questionId: string): any => {
      return answers.value[questionId]
    }

    try {
      // Handle logical OR conditions by splitting and evaluating each part
      if (conditionStr.includes('||')) {
        const orConditions = conditionStr.split('||').map(c => c.trim())
        return orConditions.some(condition => evaluateCondition(condition))
      }

      // Handle logical AND conditions
      if (conditionStr.includes('&&')) {
        const andConditions = conditionStr.split('&&').map(c => c.trim())
        return andConditions.every(condition => evaluateCondition(condition))
      }

      // Handle includes syntax for checkboxes
      // Example: "services-interets.includes("aide-demenagement", "aide-caution")"
      if (conditionStr.includes('.includes(')) {
        const matches = conditionStr.match(/^(.+)\.includes\((.+)\)$/)
        if (matches && matches.length === 3) {
          const questionId = matches[1].trim()
          // Parse the comma-separated values inside the parentheses
          const valuesToCheck = matches[2]
            .split(',')
            .map(v => v.trim().replace(/^["'](.+)["']$/, '$1')) // Remove quotes

          const selectedValues = getAnswerValue(questionId)

          // If no selection made yet, return false
          if (!selectedValues) { return false }

          // For a single value (radio buttons), check if it's in the values to check
          if (typeof selectedValues === 'string') {
            return valuesToCheck.includes(selectedValues)
          }

          // For multiple values (checkboxes), check if at least one value is in the selected values
          if (Array.isArray(selectedValues)) {
            return valuesToCheck.some(v => selectedValues.includes(v))
          }

          return false
        }
      }

      // Handle comparison operations
      const comparisonOperators = ['>=', '<=', '>', '<', '=', '!=']
      for (const operator of comparisonOperators) {
        if (conditionStr.includes(operator)) {
          const [leftSide, rightSide] = conditionStr.split(operator).map(s => s.trim())
          const leftValue = getAnswerValue(leftSide)

          // If the question hasn't been answered yet, return false
          if (leftValue === undefined) { return false }

          // Parse right side value
          let rightValue: any = rightSide

          // Try to convert to number if applicable
          if (!isNaN(Number(rightValue))) {
            rightValue = Number(rightValue)
          }

          // Handle date comparison
          const isLeftDate = typeof leftValue === 'string'
            && /^\d{4}-\d{2}-\d{2}$/.test(leftValue)
          const isRightDate = typeof rightValue === 'string'
            && /^\d{4}-\d{2}-\d{2}$/.test(rightValue)

          if (isLeftDate && isRightDate) {
            const leftDate = new Date(leftValue)
            const rightDate = new Date(rightValue)

            switch (operator) {
              case '>': return leftDate > rightDate
              case '>=': return leftDate >= rightDate
              case '<': return leftDate < rightDate
              case '<=': return leftDate <= rightDate
              case '=': return leftDate.getTime() === rightDate.getTime()
              case '!=': return leftDate.getTime() !== rightDate.getTime()
            }
          }

          // Compare numbers or strings
          switch (operator) {
            case '>': return leftValue > rightValue
            case '>=': return leftValue >= rightValue
            case '<': return leftValue < rightValue
            case '<=': return leftValue <= rightValue
            case '=': return leftValue == rightValue
            case '!=': return leftValue != rightValue
          }
        }
      }

      // If no operators matched, check if the condition is a single value
      // This handles cases like checking if a checkbox is checked
      return !!getAnswerValue(conditionStr)
    }
    catch (error) {
      console.error('Error evaluating condition:', conditionStr, error)
      return false
    }
  }

  // Determine the next question based on answers
  function getNextQuestionId (): { nextQuestionId: string | null, nextStepId: string | null } {
    if (!currentQuestionId.value) { return { nextQuestionId: null, nextStepId: null } }

    // Find the current question (can be in steps or triggered questions)
    const { question: currentQ, stepId: currentStepId } = findQuestionById(currentQuestionId.value)

    if (!currentQ) { return { nextQuestionId: null, nextStepId: null } }

    // If there's a bypassToQuestion array with conditions
    if (currentQ.bypassToQuestion && currentQ.bypassToQuestion.length > 0) {
      // Find the first matching condition
      for (const next of currentQ.bypassToQuestion) {
        if (evaluateCondition(next.condition)) {
          // Find which step contains this question (if any)
          const { stepId: nextStepId } = findQuestionById(next.question)
          return { nextQuestionId: next.question, nextStepId }
        }
      }
    }

    // For triggered questions, use the nextQuestion field if available
    if (findTriggeredQuestion(currentQuestionId.value) && currentQ.nextQuestion) {
      const { stepId: nextStepId } = findQuestionById(currentQ.nextQuestion)
      return { nextQuestionId: currentQ.nextQuestion, nextStepId }
    }

    // If no conditions matched and not a triggered question, find the next question in the current step
    if (currentStepId && currentStep.value) {
      const currentQuestionIndex = currentStep.value.questions.findIndex(
        (q: any) => q.id === currentQuestionId.value
      )

      if (currentQuestionIndex >= 0 && currentQuestionIndex < currentStep.value.questions.length - 1) {
        return {
          nextQuestionId: currentStep.value.questions[currentQuestionIndex + 1].id,
          nextStepId: currentStepId
        }
      }
    }

    // If there are no more questions in this step, move to the next step
    if (surveySchema.value && currentStepId) {
      const currentStepIndex = surveySchema.value.steps.findIndex(
        (step: any) => step.id === currentStepId
      )

      if (currentStepIndex >= 0 && currentStepIndex < surveySchema.value.steps.length - 1) {
        const nextStep = surveySchema.value.steps[currentStepIndex + 1]
        if (nextStep.questions && nextStep.questions.length > 0) {
          return {
            nextQuestionId: nextStep.questions[0].id,
            nextStepId: nextStep.id
          }
        }
      }
    }

    // No more questions
    return { nextQuestionId: null, nextStepId: null }
  }

  // Go to the next question
  function goToNextQuestion () {
    const result = getNextQuestionId()

    if (result.nextQuestionId) {
      // Update step ID if we're moving to a different step
      if (result.nextStepId && result.nextStepId !== currentStepId.value) {
        currentStepId.value = result.nextStepId
      }
      else if (!result.nextStepId) {
        // We're moving to a triggered question
        // Keep the current step as context, but make the UI show the triggered question
      }

      currentQuestionId.value = result.nextQuestionId
      return true
    }
    return false
  }

  // Go to the previous question (simplified navigation)
  function goToPreviousQuestion () {
    // This is more complex with triggered questions, as we need to track question history
    // For now, we'll implement a simplified version that only works within regular steps

    // If we're in a triggered question, we can't reliably go back
    if (currentQuestionId.value && findTriggeredQuestion(currentQuestionId.value)) {
      console.warn('Cannot navigate back from a triggered question')
      return false
    }

    if (!currentStep.value) { return false }

    const currentQuestionIndex = currentStep.value.questions.findIndex(
      (q: any) => q.id === currentQuestionId.value
    )

    if (currentQuestionIndex > 0) {
      currentQuestionId.value = currentStep.value.questions[currentQuestionIndex - 1].id
      return true
    }

    // If we're at the first question of a step, go to the previous step
    if (!surveySchema.value) { return false }

    const currentStepIndex = surveySchema.value.steps.findIndex(
      (cat: any) => cat.id === currentStepId.value
    )

    if (currentStepIndex > 0) {
      const prevStep = surveySchema.value.steps[currentStepIndex - 1]
      currentStepId.value = prevStep.id

      if (prevStep.questions && prevStep.questions.length > 0) {
        currentQuestionId.value = prevStep.questions[prevStep.questions.length - 1].id
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

    // Count all regular questions in steps
    const stepsQuestionsCount = surveySchema.value.steps.reduce(
      (count: number, step: any) => count + (step.questions ? step.questions.length : 0),
      0
    )

    // We don't include triggered questions in the total count for progress calculation
    // since they are optional and not part of the main flow
    const totalQuestions = stepsQuestionsCount

    // Count answered questions (including triggered questions that have been answered)
    const answeredQuestions = Object.keys(answers.value).length

    return Math.min(Math.round((answeredQuestions / totalQuestions) * 100), 100)
  })

  // Check if we're at the last question
  const isLastQuestion = computed(() => {
    return getNextQuestionId().nextQuestionId === null
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
    isTriggeredQuestion,
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
  persist: {
    pick: ['answers', 'currentQuestionId', 'currentStepId']
  }
})
