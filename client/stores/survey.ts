export const useFormStore = defineStore('form', () => {
  /**
   * State
   */
  const answers = ref<SurveyAnswers>({})
  const currentQuestionId = ref<string | null>(null)

  /**
   * Composables
   */
  const matomo = useMatomo()
  const { debugMode } = storeToRefs(useSurveyDebugStore())
  const {
    schema,
    state: schemaState,
    load: loadSchema
  } = useSurveySchema()

  /**
   * Computed properties
   */
  const hasAnswers = computed<boolean>(() => {
    return Object.keys(answers.value).length > 0
  })

  const currentStep = computed<SurveyStep | null>(() => {
    const step = schema.value?.steps
      .find((step) => {
        return step.questions
          .some((question) => {
            return question.id === currentQuestionId.value
          })
      })
    return step ?? null
  })

  const currentStepId = computed<string | null>(() => {
    return currentStep.value?.id ?? null
  })

  const currentStepIndex = computed<number | null>(() => {
    if (!schema.value) {
      return null
    }

    const stepIndex = schema.value.steps.findIndex((step) => {
      return step.id === currentStepId.value
    })

    if (stepIndex === -1) {
      return null
    }

    return stepIndex + 1 // +1 to match the number of steps
  })

  const questions = computed<SurveyQuestion[]>(() => {
    return schema.value?.steps
      .flatMap((step) => {
        return step.questions
      }) ?? []
  })

  const groupedQuestions = computed<QuestionGroup[]>(() => {
    return schema.value?.steps.map((step) => {
      const questions = step.questions.map((question) => {
        return {
          id: question.id,
          title: question.title,
          answered: !!answers.value[question.id],
          visible: isQuestionVisible(question.id),
        }
      })
      return {
        title: step.title,
        questions,
      }
    }) ?? []
  })

  const currentQuestion = computed<SurveyQuestion | null>(() => {
    if (!currentQuestionId.value) {
      if (debugMode.value) {
        // eslint-disable-next-line no-console
        console.log('[FormStore] No current step or question ID')
      }
      return null
    }

    // Find the current question in the ordered list
    const currentQuestion = questions.value
      .find((question) => {
        return question.id === currentQuestionId.value
      })

    if (!currentQuestion) {
      if (debugMode.value) {
        console.warn(`[FormStore] Current question ${currentQuestionId.value} not found in ordered list`)
      }
      return null
    }

    if (debugMode.value) {
      // eslint-disable-next-line no-console
      console.log('[FormStore] Current question:', currentQuestion)
    }

    return currentQuestion
  })

  const nextVisibleQuestion = computed<SurveyQuestion | null>(() => {
    if (!currentQuestionId.value) {
      return null
    }

    // Find the current question's index in the ordered list
    const currentIndex = questions.value
      .findIndex((question) => {
        return question.id === currentQuestionId.value
      })

    if (currentIndex === -1) {
      if (debugMode.value) {
        console.warn(`[FormStore] Current question ${currentQuestionId.value} not found in ordered list`)
      }
      return null
    }

    // Look for the next visible question in the ordered list
    for (let i = currentIndex + 1; i < questions.value.length; i++) {
      const nextQuestion = questions.value[i]
      if (isQuestionVisible(nextQuestion.id)) {
        if (debugMode.value) {
          // eslint-disable-next-line no-console
          console.log(`[FormStore] Next visible question in schema order: ${nextQuestion.id}`)
        }

        return nextQuestion
      }
    }

    return null
  })

  const previousVisibleQuestion = computed<SurveyQuestion | null>(() => {
    if (!currentQuestionId.value) {
      return null
    }

    // Find the current question's index in the ordered list
    const currentIndex = questions.value
      .findIndex((question) => {
        return question.id === currentQuestionId.value
      })

    if (currentIndex === -1) {
      if (debugMode.value) {
        console.warn(`[FormStore] Current question ${currentQuestionId.value} not found in ordered list`)
      }
      return null
    }

    // Look for the previous visible question in the ordered list
    for (let i = currentIndex - 1; i >= 0; i--) {
      const previousQuestion = questions.value[i]
      if (isQuestionVisible(previousQuestion.id)) {
        if (debugMode.value) {
          // eslint-disable-next-line no-console
          console.log(`[FormStore] Previous visible question in schema order: ${previousQuestion.id}`)
        }

        return previousQuestion
      }
    }

    return null
  })

  const isFirstQuestion = computed(() => {
    return previousVisibleQuestion.value === null
  })

  const isLastQuestion = computed(() => {
    return nextVisibleQuestion.value === null
  })

  const progress = computed(() => {
    if (!schema.value) {
      return 0
    }

    // Count all visible questions
    let visibleQuestionsCount = questions.value
      .filter((question) => {
        return isQuestionVisible(question.id)
      })
      .length ?? 0

    // If there are no visible questions (unlikely but possible), use total questions count
    if (visibleQuestionsCount === 0) {
      visibleQuestionsCount = questions.value.length
    }

    // Count answered questions - but only count those that are visible
    const answeredVisibleQuestionsCount = Object.keys(answers.value)
      .filter((questionId) => {
        return isQuestionVisible(questionId)
      })
      .length

    return Math.min(Math.round((answeredVisibleQuestionsCount / visibleQuestionsCount) * 100), 100)
  })

  /**
   * Methods
   */

  function resetForm () {
    answers.value = {}
    // Reset to first category/question
    if (schema.value) {
      currentQuestionId.value = questions.value[0]?.id ?? null
    }
  }

  async function loadSurveySchema (formId: string) {
    const { needsReset } = await loadSchema(formId)

    if (needsReset) {
      // Log version change and reset form
      console.warn(`Form version changed with forceRefresh flag`)
      resetForm()
    }
  }

  function findQuestionById (questionId: string): SurveyQuestion | null {
    if (!schema.value) {
      return null
    }

    // Find the question in the ordered list
    const question = questions.value
      .find((question) => {
        return question.id === questionId
      })
    return question ?? null
  }

  function setAnswer (questionId: string, value: any) {
    answers.value[questionId] = value

    // Add debug logging when debug mode is enabled
    if (debugMode.value) {
      // eslint-disable-next-line no-console
      console.log(`[FormStore] Answer set for ${questionId}:`, value)
    }

    // Track the answer in analytics
    const question = findQuestionById(questionId)
    if (question) {
      const simulateurId = schema.value?.id ?? 'unknown'
      matomo.trackSurveyAnswer(simulateurId, questionId, question.title)
    }
  }

  function isQuestionVisible (questionId: string): boolean {
    const question = findQuestionById(questionId)

    if (!question) {
      return false
    }

    // If the question has a visibility condition, evaluate it
    if (question.visibleWhen) {
      const isVisible = evaluateCondition(question.visibleWhen, answers.value)

      if (debugMode.value) {
        // eslint-disable-next-line no-console
        console.log(`[FormStore] Visibility check for ${questionId}: ${isVisible} (condition: ${question.visibleWhen})`)
      }

      return isVisible
    }

    // By default, a question is visible
    return true
  }

  function goToNextQuestion () {
    if (nextVisibleQuestion.value) {
      // Update the current question
      currentQuestionId.value = nextVisibleQuestion.value.id
      return true
    }
    return false
  }

  function goToPreviousQuestion () {
    if (previousVisibleQuestion.value) {
      // Update the current question
      currentQuestionId.value = previousVisibleQuestion.value.id
      return true
    }
    return false
  }

  return {
    schema,
    schemaState,
    answers,
    currentQuestionId,
    currentStepId,
    currentStepIndex,
    currentStep,
    currentQuestion,
    nextVisibleQuestion,
    previousVisibleQuestion,
    progress,
    isFirstQuestion,
    isLastQuestion,
    hasAnswers,

    loadSurveySchema,
    resetForm,
    setAnswer,
    goToNextQuestion,
    goToPreviousQuestion,
    groupedQuestions
  }
}, {
  persist: {
    pick: [
      'answers',
      'currentQuestionId',
      'currentStepId',
      'formVersions',
    ]
  }
})
