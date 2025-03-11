declare global {
  interface SurveyAnswer {
    [key: string]: boolean | number | string | undefined | string[] | null
  }
}

export {}
