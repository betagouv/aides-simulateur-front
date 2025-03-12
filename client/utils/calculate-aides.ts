import {
  famillesVariables,
  foyersFiscauxVariables,
  individusVariables,
  menagesVariables
} from '~/utils/aides-mapping-inputs'

import {
  famillesQuestionsVariables,
  foyersFiscauxQuestionsVariables,
  individusQuestionsVariables,
  menagesQuestionsVariables
} from '@/utils/aides-mapping-questions'

const YEAR = '2025'
export const MONTH = `${YEAR}-01`
const ETERNITY_PERIOD = 'ETERNITY'

export const INDIVIDU_ID = 'usager'
export const MENAGE_ID = `menage_${INDIVIDU_ID}`
export const FOYER_FISCAL_ID = `foyer_fiscal_${INDIVIDU_ID}`
export const FAMILLE_ID = `famille_${INDIVIDU_ID}`
const UNDEFINED_ENTITY_ID = 'INCONNU'

enum Entites {
  Individus = 'individus',
  Menages = 'menages',
  FoyerFiscaux = 'foyers_fiscaux',
  Familles = 'familles'
}

function getEntityId (entity: Entites): string {
  switch (entity) {
    case Entites.Individus:
      return INDIVIDU_ID

    case Entites.Menages:
      return MENAGE_ID

    case Entites.FoyerFiscaux:
      return FOYER_FISCAL_ID

    case Entites.Familles:
      return FAMILLE_ID

    default:
      // should not happen for simulators calling openfisca-france
      // (the entities list might change for a simulator calculating beyond natural persons)
      console.error(`Entité inconnue: ${entity}`)
      return UNDEFINED_ENTITY_ID
  }
}

function initRequest (): OpenFiscaCalculationRequest {
  // eslint-disable-next-line no-console
  console.debug('initRequest...')
  const request: OpenFiscaCalculationRequest = {
    individus: {
      [INDIVIDU_ID]: {}
    },
    menages: {
      [MENAGE_ID]: {
        personne_de_reference: [INDIVIDU_ID],
        conjoint: [],
        enfants: []
      }
    },
    foyers_fiscaux: {
      [FOYER_FISCAL_ID]: {
        declarants: [INDIVIDU_ID],
        personnes_a_charge: []
      }
    },
    familles: {
      [FAMILLE_ID]: {
        parents: [INDIVIDU_ID],
        enfants: []
      }
    }
  }
  return request
}

/**
 * for a survey answer found in the mapping, format it for an openfisca web API request
 * with the openfisca variable period
 * and the answer value already validated for openfisca usage
 */
function formatSurveyAnswerToRequest (
  variableMapping: OpenFiscaMapping,
  value: boolean | number | string // VariableValueOnPeriod allowed types
): { [openfiscaKey: string]: VariableValueOnPeriod } {
  const result: { [key: string]: VariableValueOnPeriod } = {}
  const period = variableMapping.period === 'MONTH' ? MONTH : ETERNITY_PERIOD
  result[variableMapping.openfiscaVariableName] = {
    [period]: value
  }
  return result
}

/**
 * one step of the openfisca web API request building:
 * for a survey answer found in the mapping, add the answer data to the given request
 * unless it's a survey answer that should not be sent to the calculation (excluded answers)
 * @thorows UnknownEntityError if the given entity is not referenced for the current simulation
 * @throws UndefinedValueError if some issue occured on the survey input 
 * @throws UnexpectedValueError if a mapping is defined on an unexpected form input type
 */
function addSurveyAnswerToRequest (
  answerKey: string,
  answerValue: boolean | number | string | undefined,
  mapping: AidesSimplifieesMapping,
  entity: Entites,
  request: OpenFiscaCalculationRequest
): OpenFiscaCalculationRequest {
  if (! ('exclude' in mapping) ) {
    if (answerValue === undefined) {
      throw new UndefinedValueError(answerKey)
    }
    if (typeof answerValue !== 'boolean' && typeof answerValue !== 'number' && typeof answerValue !== 'string') {
      throw new UnexpectedValueError(answerKey)
    }

    const openfiscaVariableName: string = mapping.openfiscaVariableName
    const formattedAnswer = formatSurveyAnswerToRequest(mapping, answerValue)

    const entityId = getEntityId(entity)
    if (entityId === UNDEFINED_ENTITY_ID) {
      console.error(`Variable '${answerKey}' d'entité imprévue ou inconnue: ${entity}`)
      throw new UnknownEntityError(answerKey)
    }

  request[entity][entityId][openfiscaVariableName] = { ...formattedAnswer[openfiscaVariableName] }
  }
  return request
}

/**
 * format a question to the openfisca web API
 * to calculate the variable defined in variableMapping
 */
function formatSurveyQuestionToRequest (
  openfiscaVariableName: string,
  periodType: string
) {
  const result: { [key: string]: VariableToCalculateOnPeriod } = {}
  const period = periodType === 'MONTH' ? MONTH : ETERNITY_PERIOD
  result[openfiscaVariableName] = {
    [period]: null
  }
  return result
}

function addSurveyQuestionToRequest (
  questionKey: string,
  mapping: OpenFiscaMapping,
  entity: Entites,
  request: OpenFiscaCalculationRequest
): OpenFiscaCalculationRequest {
  const openfiscaVariableName = mapping.openfiscaVariableName
  const formattedQuestion = formatSurveyQuestionToRequest(openfiscaVariableName, mapping.period)

  const entityId = getEntityId(entity)
  if (entityId === UNDEFINED_ENTITY_ID) {
    console.error(`Variable '${questionKey}' d'entité imprévue ou inconne: ${entity}`)
    throw new UnknownEntityError(questionKey)
  }

  request[entity][entityId][openfiscaVariableName] = { ...formattedQuestion[openfiscaVariableName] }
  return request
}

function addAnswersToRequest (
  request: OpenFiscaCalculationRequest,
  answers: SurveyAnswers
): OpenFiscaCalculationRequest {
  for (const [answerKey, answerValue] of Object.entries(answers)) {
    const typedValue = answerValue as unknown as string | number | boolean | undefined // bypass 'any' type infered by loop
    try {
      if (answerKey in individusVariables) {
        request = addSurveyAnswerToRequest(answerKey, typedValue, individusVariables[answerKey], Entites.Individus, request)
      }
      else if (answerKey in menagesVariables) {
        request = addSurveyAnswerToRequest(answerKey, typedValue, menagesVariables[answerKey], Entites.Menages, request)
      }
      else if (answerKey in famillesVariables) {
        request = addSurveyAnswerToRequest(answerKey, typedValue, famillesVariables[answerKey], Entites.Familles, request)
      }
      else if (answerKey in foyersFiscauxVariables) {
        request = addSurveyAnswerToRequest(answerKey, typedValue, foyersFiscauxVariables[answerKey], Entites.FoyerFiscaux, request)
      }
      else {
        console.error(`Variable d'entrée de formulaire inconnue : ${answerKey}`)
        throw new UnknownVariableError(answerKey)
      }
    }
    catch (error) {
      if (
        error instanceof UnknownVariableError  
        || error instanceof UnknownEntityError 
        || error instanceof UnexpectedValueError
        || error instanceof UndefinedValueError) {
        console.warn(`Donnée '${answerKey}' non transcrite dans la requête de calcul suite à l'erreur '${error}'.`)
      } else {
        console.error(`Donnée '${answerKey}' non transcrite dans la requête de calcul suite à l'erreur inattendue '${error}'.`);
      }
    }
  }
  return request
}

function addQuestionsToRequest (
  request: OpenFiscaCalculationRequest,
  questions: string[]
): OpenFiscaCalculationRequest {
  for (const questionKey of questions) {
    try {
      if (questionKey in individusQuestionsVariables) {
        request = addSurveyQuestionToRequest(questionKey, individusQuestionsVariables[questionKey], Entites.Individus, request)
      }
      else if (questionKey in menagesQuestionsVariables) {
        request = addSurveyQuestionToRequest(questionKey, menagesQuestionsVariables[questionKey], Entites.Menages, request)
      }
      else if (questionKey in famillesQuestionsVariables) {
        request = addSurveyQuestionToRequest(questionKey, famillesQuestionsVariables[questionKey], Entites.Familles, request)
      }
      else if (questionKey in foyersFiscauxQuestionsVariables) {
        request = addSurveyQuestionToRequest(questionKey, foyersFiscauxQuestionsVariables[questionKey], Entites.FoyerFiscaux, request)
      }
      else {
        console.error(`Variable de question inconnue : ${questionKey}`)
        throw new UnknownVariableError(questionKey)
      }
    }
    catch (anyError) {
      // UnknownVariableError, UnknownEntityError, UnexpectedValueError, UndefinedValueError
      console.error(`Question '${questionKey}' non transcrite dans la requête de calcul suite à l'erreur '${anyError}'.`)
    }
  }

  return request
}

export function buildRequest (answers: SurveyAnswers, questions: string[]): OpenFiscaCalculationRequest {
  // eslint-disable-next-line no-console
  console.debug('buildRequest...')
  let request: OpenFiscaCalculationRequest = initRequest()
  // sets: request[some entity][the entity id]
  // eslint-disable-next-line no-console
  console.debug(request)

  request = addAnswersToRequest(request, answers) // user answers
  request = addQuestionsToRequest(request, questions) // simulator questions to rules engine

  return request
}

export async function fetchOpenFiscaFranceCalculation (
  request: OpenFiscaCalculationRequest,
): Promise<OpenFiscaCalculationResponse> {
  // eslint-disable-next-line no-console
  console.debug('fetchOpenFiscaFranceCalculation...')
  // eslint-disable-next-line no-console
  console.debug('request:')
  // eslint-disable-next-line no-console
  console.debug(request)

  const requestSettings = {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  }

  const config = useRuntimeConfig()
  const response = await fetch(
    config.public.apiEndpointOpenFiscaFranceCalculate,
    requestSettings,
  )

  let result = await response.json()

  if (!response.ok) {
    result = {
      error: response.status,
      message: result
    }
  }

  return result
}
