declare global {

  interface SurveyChoice {
    id: string
    title: string
  }

  interface SurveyQuestion {
    id: string
    title: string
    description?: string
    type: 'radio' | 'checkbox' | 'number' | 'date' | 'text' | 'boolean'
    notion: {
      id: string
      buttonLabel: string
    }
    autocompleteFunction?: string
    choices?: SurveyChoice[]
    nextQuestion?: string
    bypassToQuestion?: Array<{
      condition: string
      question: string
    }>
  }

  interface SurveyAnswers {
    [key: string]: string | string[] | number | boolean | undefined
  }

  interface SurveyStep {
    id: string
    title: string
    questions: SurveyQuestion[]
  }

  interface SurveySchema {
    id: string
    title: string
    description: string
    version: string
    forceRefresh?: boolean
    steps: SurveyStep[]
    triggeredQuestions?: SurveyQuestion[]
  }
}

export {}
