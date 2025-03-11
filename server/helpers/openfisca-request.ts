import {
  UndefinedValueError,
  UnexpectedValueError,
  UnknownEntityError,
  UnknownVariableError
} from './openfisca-errors'

import {
  famillesVariables,
  individusVariables,
  menagesVariables
} from './openfisca-mappings'

enum Entites {
  Individus = 'individus',
  Menages = 'menages',
  FoyerFiscaux = 'foyers_fiscaux',
  Familles = 'familles'
}

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

function formatSurveyAnswerToRequest (
  variableMapping: OpenFiscaMapping,
  value: boolean | number | string
) {
  const result: { [key: string]: VariableValueOnPeriod } = {}
  const period = variableMapping.period === 'MONTH' ? MONTH : ETERNITY_PERIOD
  result[variableMapping.openfiscaVariableName] = {
    [period]: value
  }
  return result
}

function addSurveyAnswerToRequest (
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

export function buildRequest (answers: SurveyAnswer): OpenFiscaCalculationRequest {
  let request: OpenFiscaCalculationRequest = initRequest()

  for (const [answerKey, answerValue] of Object.entries(answers)) {
    try {
      if (answerValue === undefined) {
        throw new UndefinedValueError(answerKey)
      }
      if (typeof answerValue !== 'boolean' && typeof answerValue !== 'number' && typeof answerValue !== 'string') {
        throw new UnexpectedValueError(answerKey)
      }

      if (answerKey in individusVariables) {
        request = addSurveyAnswerToRequest(answerKey, answerValue, individusVariables[answerKey], Entites.Individus, request)
      }
      else if (answerKey in menagesVariables) {
        request = addSurveyAnswerToRequest(answerKey, answerValue, menagesVariables[answerKey], Entites.Menages, request)
      }
      else if (answerKey in famillesVariables) {
        request = addSurveyAnswerToRequest(answerKey, answerValue, famillesVariables[answerKey], Entites.Familles, request)
      }
      else {
        console.warn(`Variable inconnue : ${answerKey}`)
        throw new UnknownVariableError(answerKey)
      }
    }
    catch (anyError) {
      console.warn(`Donnée '${answerKey}' non transcrite dans la requête de calcul suite à l'erreur '${anyError}'.`)
    }
  }
  return request
}
