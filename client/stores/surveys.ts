export const useSurveysStore = defineStore('surveys', () => {
  /**
   * State
   */
  const answers = ref<{ [simulateurId: string]: SurveyAnswers }>({})
  const currentQuestionId = ref<{ [simulateurId: string]: string | null }>({})
  const surveySchemas = ref<{ [simulateurId: string]: SurveySchema | null }>({})
  const schemaStatus = ref<{ [simulateurId: string]: 'idle' | 'pending' | 'error' | 'success' }>({})
  const versions = ref<{ [simulateurId: string]: string }>({})
  /**
   * Composables
   */
  const matomo = useMatomo()
  const { debugMode } = storeToRefs(useSurveyDebugStore())

  /**
   * Helper methods to get/set state for a specific simulateur
   */
  const getAnswers = (simulateurId: string): SurveyAnswers => {
    return answers.value[simulateurId] || {}
  }

  const getCurrentQuestionId = (simulateurId: string): string | null => {
    return currentQuestionId.value[simulateurId] || null
  }

  const getSchema = (simulateurId: string): SurveySchema | null => {
    return surveySchemas.value[simulateurId] || null
  }

  const getSchemaStatus = (simulateurId: string): 'idle' | 'pending' | 'error' | 'success' => {
    return schemaStatus.value[simulateurId] || 'idle'
  }

  const hasAnswers = (simulateurId: string): boolean => {
    return Object.keys(getAnswers(simulateurId)).length > 0
  }

  const getQuestions = (simulateurId: string): SurveyQuestion[] => {
    const currentSchema = getSchema(simulateurId)
    return currentSchema?.steps
      .flatMap((step) => {
        return step.questions
      }) ?? []
  }

  const getCurrentStep = (simulateurId: string): SurveyStep | null => {
    const currentSchema = getSchema(simulateurId)
    const currentQId = getCurrentQuestionId(simulateurId)

    const step = currentSchema?.steps
      .find((step) => {
        return step.questions
          .some((question) => {
            return question.id === currentQId
          })
      })
    return step ?? null
  }

  const getCurrentStepId = (simulateurId: string): string | null => {
    return getCurrentStep(simulateurId)?.id ?? null
  }

  const getCurrentStepIndex = (simulateurId: string): number | null => {
    const currentSchema = getSchema(simulateurId)
    if (!currentSchema) {
      return null
    }

    const stepIndex = currentSchema.steps.findIndex((step) => {
      return step.id === getCurrentStepId(simulateurId)
    })

    if (stepIndex === -1) {
      return null
    }

    return stepIndex + 1 // +1 to match the number of steps
  }

  const getGroupedQuestions = (simulateurId: string): QuestionGroup[] => {
    const currentSchema = getSchema(simulateurId)
    const currentAnswers = getAnswers(simulateurId)

    return currentSchema?.steps.map((step) => {
      const questions = step.questions.map((question) => {
        return {
          id: question.id,
          title: question.title,
          answered: !!currentAnswers[question.id],
          visible: isQuestionVisible(simulateurId, question.id),
        }
      })
      return {
        title: step.title,
        questions,
      }
    }) ?? []
  }

  const getCurrentQuestion = (simulateurId: string): SurveyQuestion | null => {
    const currentQId = getCurrentQuestionId(simulateurId)
    if (!currentQId) {
      if (debugMode.value) {
        // eslint-disable-next-line no-console
        console.log(`[Surveys Store][${simulateurId}] No current question ID found`)
      }
      return null
    }

    // Find the current question in the ordered list
    const questions = getQuestions(simulateurId)
    const currentQuestion = questions
      .find((question) => {
        return question.id === currentQId
      })

    if (!currentQuestion) {
      if (debugMode.value) {
        console.warn(`[Surveys Store][${simulateurId}] Current question ${currentQId} not found in ordered list`)
      }
      return null
    }

    if (debugMode.value) {
      // eslint-disable-next-line no-console
      console.log(`[Surveys store][${simulateurId}] Current question: ${currentQuestion.id}`)
    }

    return currentQuestion
  }

  const getNextVisibleQuestion = (simulateurId: string): SurveyQuestion | null => {
    const currentQId = getCurrentQuestionId(simulateurId)
    if (!currentQId) {
      return null
    }

    const questions = getQuestions(simulateurId)
    // Find the current question's index in the ordered list
    const currentIndex = questions
      .findIndex((question) => {
        return question.id === currentQId
      })

    if (currentIndex === -1) {
      if (debugMode.value) {
        console.warn(`[Surveys Store][${simulateurId}] Current question ${currentQId} not found in ordered list`)
      }
      return null
    }

    // Look for the next visible question in the ordered list
    for (let i = currentIndex + 1; i < questions.length; i++) {
      const nextQuestion = questions[i]
      if (isQuestionVisible(simulateurId, nextQuestion.id)) {
        if (debugMode.value) {
          // eslint-disable-next-line no-console
          console.log(`[Surveys store][${simulateurId}] Next visible question in schema order: ${nextQuestion.id}`)
        }

        return nextQuestion
      }
    }

    return null
  }

  const getPreviousVisibleQuestion = (simulateurId: string): SurveyQuestion | null => {
    const currentQId = getCurrentQuestionId(simulateurId)
    if (!currentQId) {
      return null
    }

    const questions = getQuestions(simulateurId)
    // Find the current question's index in the ordered list
    const currentIndex = questions
      .findIndex((question) => {
        return question.id === currentQId
      })

    if (currentIndex === -1) {
      if (debugMode.value) {
        console.warn(`[surveysStore][${simulateurId}] Current question ${currentQId} not found in ordered list`)
      }
      return null
    }

    // Look for the previous visible question in the ordered list
    for (let i = currentIndex - 1; i >= 0; i--) {
      const previousQuestion = questions[i]
      if (isQuestionVisible(simulateurId, previousQuestion.id)) {
        if (debugMode.value) {
          // eslint-disable-next-line no-console
          console.log(`[surveysStore][${simulateurId}] Previous visible question in schema order: ${previousQuestion.id}`)
        }

        return previousQuestion
      }
    }

    return null
  }

  const isFirstQuestion = (simulateurId: string): boolean => {
    return getPreviousVisibleQuestion(simulateurId) === null
  }

  const isLastQuestion = (simulateurId: string): boolean => {
    return getNextVisibleQuestion(simulateurId) === null
  }

  const getProgress = (simulateurId: string): number => {
    const currentSchema = getSchema(simulateurId)
    const currentAnswers = getAnswers(simulateurId)

    if (!currentSchema) {
      return 0
    }

    const questions = getQuestions(simulateurId)

    // Count all visible questions
    let visibleQuestionsCount = questions
      .filter((question) => {
        return isQuestionVisible(simulateurId, question.id)
      })
      .length ?? 0

    // If there are no visible questions (unlikely but possible), use total questions count
    if (visibleQuestionsCount === 0) {
      visibleQuestionsCount = questions.length
    }

    // Count answered questions - but only count those that are visible
    const answeredVisibleQuestionsCount = Object.keys(currentAnswers)
      .filter((questionId) => {
        return isQuestionVisible(simulateurId, questionId)
      })
      .length

    return Math.min(Math.round((answeredVisibleQuestionsCount / visibleQuestionsCount) * 100), 100)
  }

  /**
   * Methods
   */

  function setFirstQuestion(simulateurId: string) {
    const questions = getQuestions(simulateurId)
    currentQuestionId.value[simulateurId] = questions[0]?.id ?? null
  }

  function resetSurvey(simulateurId: string) {
    answers.value[simulateurId] = {}

    // Reset to first category/question
    setFirstQuestion(simulateurId)
  }

  function updateSchemaState(simulateurId: string, status: 'idle' | 'pending' | 'error' | 'success') {
    if (status === 'error') {
      // eslint-disable-next-line no-console
      console.error(`[Surveys store][${simulateurId}] Error loading survey schema`)
    } else if (debugMode.value) {
      // eslint-disable-next-line no-console
      console.log(`[Surveys store][${simulateurId}] Schema status:`, status)
    }
    schemaStatus.value[simulateurId] = status
  }

  function updateSchema(simulateurId: string, schema: SurveySchema) {
    try {
      // Check if we need to reset the form based on version and forceRefresh
      const storedVersion = versions.value[simulateurId]
      const newVersion = schema.version

      // Store the new version
      versions.value[simulateurId] = newVersion
      surveySchemas.value[simulateurId] = schema

      if (debugMode.value) {
        // eslint-disable-next-line no-console
        console.log(`[Surveys store][${simulateurId}] Loaded survey schema:`, schema)
      }

      const needsReset = (
        schema.forceRefresh
        || !storedVersion
        || compareVersions(newVersion, storedVersion) > 0
      )

      if (needsReset) {
        // Log version change and reset form
        console.warn(`[Surveys store][${simulateurId}] Schema version changed, resetting survey...`)
        resetSurvey(simulateurId)
      }

      // Initialize if this is first load
      if (!currentQuestionId.value[simulateurId]) {
        setFirstQuestion(simulateurId)
      }
    }
    catch (error) {
      // eslint-disable-next-line no-console
      console.error(`[Surveys store][${simulateurId}] Error updating schema:`, error)
    }
  }

  async function loadSurveySchema(simulateurId: string) {
    const { data: newSchema, status: schemaStatus } = useFetch<SurveySchema>(`/forms/${simulateurId}.json`, {
      server: false,
    })
    watch(schemaStatus, (newStatus) => {
      updateSchemaState(simulateurId, newStatus)
    }, { immediate: true })
    watch(newSchema, (newSchema) => {
      if (newSchema) {
        updateSchema(simulateurId, newSchema)
      }
    })
  }

  function findQuestionById(simulateurId: string, questionId: string): SurveyQuestion | null {
    const questions = getQuestions(simulateurId)

    // Find the question in the ordered list
    const question = questions
      .find((question) => {
        return question.id === questionId
      })
    return question ?? null
  }

  function setAnswer(simulateurId: string, questionId: string, value: any) {
    // Initialize answers object for this simulateur if it doesn't exist
    if (!answers.value[simulateurId]) {
      answers.value[simulateurId] = {}
    }

    answers.value[simulateurId][questionId] = value

    // Add debug logging when debug mode is enabled
    if (debugMode.value) {
      // eslint-disable-next-line no-console
      console.log(`[surveysStore][${simulateurId}] Answer set for ${questionId}:`, value)
    }

    // Track the answer in analytics
    const question = findQuestionById(simulateurId, questionId)
    if (question) {
      matomo.trackSurveyAnswer(simulateurId, questionId, question.title)
    }
  }

  function isQuestionVisible(simulateurId: string, questionId: string): boolean {
    const question = findQuestionById(simulateurId, questionId)
    const currentAnswers = getAnswers(simulateurId)

    if (!question) {
      return false
    }

    // If the question has a visibility condition, evaluate it
    if (question.visibleWhen) {
      const isVisible = evaluateCondition(question.visibleWhen, currentAnswers)

      if (debugMode.value) {
        // eslint-disable-next-line no-console
        console.log(`[surveysStore][${simulateurId}] Visibility check for ${questionId}: ${isVisible} (condition: ${question.visibleWhen})`)
      }

      return isVisible
    }

    // By default, a question is visible
    return true
  }

  function goToNextQuestion(simulateurId: string) {
    const nextQuestion = getNextVisibleQuestion(simulateurId)
    if (nextQuestion) {
      // Update the current question
      currentQuestionId.value[simulateurId] = nextQuestion.id
      return true
    }
    return false
  }

  function goToPreviousQuestion(simulateurId: string) {
    const prevQuestion = getPreviousVisibleQuestion(simulateurId)
    if (prevQuestion) {
      // Update the current question
      currentQuestionId.value[simulateurId] = prevQuestion.id
      return true
    }
    return false
  }

  return {
    answers,
    currentQuestionId,
    hasAnswers,
    getAnswers,
    getCurrentQuestionId,
    getSchema,
    getSchemaStatus,
    getCurrentStep,
    getCurrentStepId,
    getCurrentStepIndex,
    getCurrentQuestion,
    getNextVisibleQuestion,
    getPreviousVisibleQuestion,
    getGroupedQuestions,
    getProgress,
    isFirstQuestion,
    isLastQuestion,
    loadSurveySchema,
    resetSurvey,
    setAnswer,
    goToNextQuestion,
    goToPreviousQuestion,
  }
}, {
  persist: {
    pick: [
      'answers',
      'currentQuestionId',
    ]
  }
})
