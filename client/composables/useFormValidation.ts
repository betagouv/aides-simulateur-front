/**
 * Composable for validating form inputs based on question types
 */
export function useFormValidation () {
  /**
   * Check if a question has a valid answer
   * @param question The question to validate
   * @param answer The answer to validate
   */
  function isAnswerValid (question: SurveyQuestion, answer: any): boolean {
    if (!question) {
      return false
    }

    // Different validation based on question type
    switch (question.type) {
      case 'radio':
      case 'date':
        // For radio and date, any non-empty value is valid
        return !!answer
      case 'boolean':
        // For boolean, both true and false are valid answers
        return answer === true || answer === false
      case 'checkbox':
        // For checkbox, the answer should be an array with at least one item
        return Array.isArray(answer) && answer.length > 0
      case 'number':
        // For number, we need to check if it's a number including 0
        return answer === 0 || !!answer
      case 'text':
        // For text, the value should not be empty
        return answer !== undefined && answer !== null && answer !== ''
      default:
        return false
    }
  }

  /**
   * Create a reactive computed property to check if the current question has a valid answer
   * @param question Ref to the current question
   * @param answers Ref to the form answers object
   */
  function useHasValidAnswer (question: Ref<SurveyQuestion | null>, answers: Ref<SurveyAnswers>) {
    return computed(() => {
      if (!question.value) {
        return false
      }

      const questionId = question.value.id
      const answer = answers.value[questionId]

      return isAnswerValid(question.value, answer)
    })
  }

  return {
    isAnswerValid,
    useHasValidAnswer
  }
}
