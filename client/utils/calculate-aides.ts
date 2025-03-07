import type { OpenFiscaMapping } from '@/utils/aides-mapping-ids'
import { famillesVariables, individusVariables, menagesVariables } from '@/utils/aides-mapping-ids'
import { 
  UnknownEntityError, 
  UndefinedValueError, 
  UnexpectedValueError, 
  UnknownVariableError 
} from '@/utils/errors'
import Survey from '~/components/form/Survey.vue'
import { 
  Entites, 
  type OpenFiscaCalculationRequest, 
  type OpenFiscaCalculationResponse, 
  type VariableValueOnPeriod 
} from '@/types/openfisca'

// const API_ENDPOINT_OPENFISCA_FRANCE_CALCULATE: URL = new URL("/calculate", "http://127.0.0.1:5000")
const API_ENDPOINT_OPENFISCA_FRANCE_CALCULATE = new URL('/calculate', 'https://aides-calculatrice-back.osc-fr1.scalingo.io')

const YEAR = '2025'
const MONTH = `${YEAR}-01`
const ETERNITY_PERIOD = 'ETERNITY'

const INDIVIDU_ID = 'usager'
const MENAGE_ID = `menage_${INDIVIDU_ID}`
const FOYER_FISCAL_ID = `foyer_fiscal_${INDIVIDU_ID}`
const FAMILLE_ID = `famille_${INDIVIDU_ID}`
const UNDEFINED_ENTITY_ID = 'INCONNU'


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
  value: boolean | number | string  // VariableValueOnPeriod allowed types
) {
  let result: { [key: string]: VariableValueOnPeriod }  = {}
  const period = variableMapping.period === 'MONTH' ? MONTH : ETERNITY_PERIOD
  result[variableMapping.openfiscaVariableName] = {
    [period]: value
  }
  return result
}

/**
 * one step of the openfisca web API request building:
 * for a survey answer found in the mapping, add the answer data to the given request
 * @thorows UnknownEntityError if the given entity is not referenced for the current simulation
 */
function addSurveyAnswerToRequest(
  answerKey: string,
  answerValue: boolean | number | string,
  mapping: OpenFiscaMapping,
  entity: Entites,
  request: OpenFiscaCalculationRequest
): OpenFiscaCalculationRequest {

  const openfiscaVariableName = mapping.openfiscaVariableName
  const formattedAnswer = formatSurveyAnswerToRequest(mapping, answerValue)

  const entityId = getEntityId(entity)
  if (entityId === UNDEFINED_ENTITY_ID) {
    console.error(`Variable '${answerKey}' d'entité imprévue ou inconne: ${entity}`)
    throw new UnknownEntityError(answerKey)
  }

  request[entity][entityId][openfiscaVariableName] = { ...formattedAnswer[openfiscaVariableName] }
  return request

}

export function buildRequest (answers: SurveyAnswer[]): OpenFiscaCalculationRequest {
  console.debug('buildRequest...')
  let request: OpenFiscaCalculationRequest = initRequest()
  // sets: request[some entity][the entity id]
  console.debug(request)

  for (const [answerKey, answerValue] of Object.entries(answers)){
    try {
      //answerValue: boolean | number | string | undefined
      if (answerValue === undefined){
        throw new UndefinedValueError(answerKey)
      }
      if (typeof answerValue !== 'boolean' && typeof answerValue !== 'number' && typeof answerValue !== 'string'){
        throw new UnexpectedValueError(answerKey)
      }

      if (answerKey in individusVariables){
        request = addSurveyAnswerToRequest(answerKey, answerValue, individusVariables[answerKey], Entites.Individus, request)
      } else if (answerKey in menagesVariables){
        request = addSurveyAnswerToRequest(answerKey, answerValue, menagesVariables[answerKey], Entites.Menages, request)
      } else if (answerKey in famillesVariables){
        request = addSurveyAnswerToRequest(answerKey, answerValue, famillesVariables[answerKey], Entites.Familles, request)
      } else {
        console.error(`Variable inconnue : ${answerKey}`)
        throw new UnknownVariableError(answerKey)
      }
    } catch (anyError){
      // UnknownVariableError, UnknownEntityError, UnexpectedValueError, UndefinedValueError
      console.error(`Donnée '${answerKey}' non transcrite dans la requête de calcul suite à l'erreur '${anyError}'.`)
    }
  }
  return request
}

export async function fetchOpenFiscaFranceCalculation (
  request: OpenFiscaCalculationRequest,
): Promise<OpenFiscaCalculationResponse> {
  console.debug('fetchOpenFiscaFranceCalculation...')
  console.debug('request:')
  console.debug(request)

  const requestSettings = {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  }

  const response = await fetch(
    API_ENDPOINT_OPENFISCA_FRANCE_CALCULATE,
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
