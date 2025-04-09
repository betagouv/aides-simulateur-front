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
    visibleWhen?: string
    notion: {
      id: string
      buttonLabel: string
    }
    autocompleteFunction?: string
    choices?: SurveyChoice[]
    min?: number
    max?: number
    step?: number
    default?: string | number | boolean
  }

  interface QuestionGroup {
    title: string
    questions: {
      id: string
      title: string
      answer?: unknown
      visible: boolean
    }[]
  }

  interface SurveyStep {
    id: string
    title: string
    questions: SurveyQuestion[]
  }

  interface SurveyTest {
    id: string
    description: string
    questionsToApi: string[]
    answers: Record<string, any>
    results: Record<string, any>
  }

  interface SurveySchema {
    version: string
    forceRefresh: boolean
    id: string
    title: string
    description: string
    steps: SurveyStep[]
    tests?: SurveyTest[]
  }

  interface SurveyAnswers {
    [key: string]: string | string[] | number | boolean | undefined
  }

  interface SurveyResults {
    data: SimulationResultsAides
    meta: {
      createdAt: Date
    }
  }
}

export {}
