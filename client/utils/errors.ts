export class UnknownVariableError extends Error {
  // unconsistency between the form and the calculation:
  // the user set a value to an input in the form
  // but the input id is not expected by the current web API request builder
  constructor (formInputId: string) {
    super(`Variable inconnue : ${formInputId}`)
    this.name = 'UnknownVariableError'
  }
}

export class UnknownEntityError extends Error {
  // unconsistency in the request builder
  constructor (formInputId: string) {
    super(`Entité inconnue pour la variable : ${formInputId}`)
    this.name = 'UnknownEntityError'
  }
}

export class UndefinedValueError extends Error {
  // the user didn't set a value in the form
  constructor (formInputId: string) {
    super(`Valeur inconnue pour la variable : ${formInputId}`)
    this.name = 'UndefinedValueError'
  }
}

export class UnexpectedValueError extends Error {
  // unconsistency between the form and the calculation:
  // the user set a value in the form
  // but the value type is not expected by the current web API request builder
  constructor (formInputId: string) {
    super(`Valeur de type inattendu pour la variable : ${formInputId}`)
    this.name = 'UnexpectedValueError'
  }
}
