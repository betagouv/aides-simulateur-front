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


function initDates(){
  const today = new Date().toISOString() // YYYY-MM-DD
  const monthDate = today.slice(0, 7)
  const month = today.slice(5, 7)
  const year = today.slice(0, 4)
  const previous_year = String(parseInt(year) - 1)

  // rolling year format:
  // https://openfisca.org/doc/coding-the-legislation/35_periods.html#periods
  const rolling_year = `month:${previous_year}-${month}:12`

  return {
    MONTH: monthDate,
    YEAR: year,
    YEAR_ROLLING: rolling_year
  }
}

// init all periods once according to today's date
export const { MONTH, YEAR, YEAR_ROLLING } = initDates()
const ETERNITY_PERIOD = 'ETERNITY' // https://openfisca.org/doc/coding-the-legislation/35_periods.html#periods
const UNDEFINED_PERIOD_TYPE = 'PERIODE_DEFNITION_INCONNUE'

export const INDIVIDU_ID = 'usager'
export const MENAGE_ID = `menage_${INDIVIDU_ID}`
export const FOYER_FISCAL_ID = `foyer_fiscal_${INDIVIDU_ID}`
export const FAMILLE_ID = `famille_${INDIVIDU_ID}`
const UNDEFINED_ENTITY_ID = 'IDENTIFIANT_ENTITE_INCONNUE'

export enum Entites {
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
      console.error(`Entité inconnue : ${entity}`)
      return UNDEFINED_ENTITY_ID
  }
}

export function getPeriod(
  periodType: 'ETERNITY' | 'YEAR' | 'YEAR_ROLLING' | 'MONTH'
): string {
  switch(periodType){
    case 'MONTH':
      return MONTH
    case 'YEAR':
      return YEAR
    case 'YEAR_ROLLING':
      return YEAR_ROLLING
    case 'ETERNITY':
      return ETERNITY_PERIOD
    default:
      console.error(`Période inconnue : ${periodType}`)
      return UNDEFINED_PERIOD_TYPE
  }
}

export function dispatchSituationProfessionnelle(
  answerKey: string,
  answerValue: boolean | number | string,
  periodType: 'ETERNITY' | 'YEAR' | 'YEAR_ROLLING' | 'MONTH'
): unknown{
  const period = getPeriod(periodType)
  if (period === UNDEFINED_PERIOD_TYPE) {
    console.error(`Variable '${answerKey}' de période imprévue ou inconnue: ${periodType}`)
    throw new UnknownPeriodError(answerKey)
  }

  let openfiscaVariableName = undefined
  
  if (answerValue == "stage"){ 
    openfiscaVariableName = 'stagiaire'
    return formatSurveyAnswerToRequest(openfiscaVariableName, period, answerValue)

  } else if (answerValue == "alternance"){
    openfiscaVariableName = 'alternant'
    return formatSurveyAnswerToRequest(openfiscaVariableName, period, answerValue)

  } else if (answerValue == "salarie-hors-alternance"){
    openfiscaVariableName = 'activite' // TypesActivite possible values: https://legislation.fr.openfisca.org/activite
    return formatSurveyAnswerToRequest(openfiscaVariableName, period, 'actif')

  } else if (answerValue == "sans-emploi"){
    openfiscaVariableName = 'activite' // TypesActivite possible values: https://legislation.fr.openfisca.org/activite
    return formatSurveyAnswerToRequest(openfiscaVariableName, period, 'chomeur')

  } else {
    console.debug(`Valeur inattendue ${answerKey}: ${answerValue}`)
    throw new UnexpectedValueError(answerKey)
  }  
}

export function dispatchSituationLogement(
  answerKey: string,
  answerValue: boolean | number | string,
  periodType: 'ETERNITY' | 'YEAR' | 'YEAR_ROLLING' | 'MONTH'
): unknown {
  const period = getPeriod(periodType)
  if (period === UNDEFINED_PERIOD_TYPE) {
    console.error(`Variable '${answerKey}' de période imprévue ou inconnue: ${periodType}`)
    throw new UnknownPeriodError(answerKey)
  }

  let openfiscaVariableName = "statut_occupation_logement"
  // possible values: https://legislation.fr.openfisca.org/statut_occupation_logement

  if (answerValue == "locataire"){
    // TypesStatutOccupationLogement: 'locataire_foyer', 'locataire_hlm', 'locataire_meuble', 'locataire_vide'
    // exemple d'input 'type-logement': "logement-foyer"
    console.debug(`Transcription simplifiee de '${answerKey}': '${answerValue}' en '${openfiscaVariableName}': 'locataire_vide'.`)
    console.debug(`Transcription pouvant être mise à jour en cas de valeur 'type-logement'`)
    return formatSurveyAnswerToRequest(openfiscaVariableName, period, 'locataire_vide')

  } else if (answerValue == "proprietaire"){
    // TypesStatutOccupationLogement: 'proprietaire' (could also be a subset: 'primo_accedant')
    return formatSurveyAnswerToRequest(openfiscaVariableName, period, 'proprietaire')

  } else if (answerValue == "heberge"){
    return formatSurveyAnswerToRequest(openfiscaVariableName, period, 'loge_gratuitement')
  
  } else if (answerValue == "sans-domicile"){
    return formatSurveyAnswerToRequest(openfiscaVariableName, period, 'sans_domicile')
  
  } else {
    console.debug(`Valeur inattendue ${answerKey}: ${answerValue}`)
    throw new UnexpectedValueError(answerKey)
  }
}

export function dispatchTypeLogement(
  answerKey: string,
  answerValue: boolean | number | string,
  periodType: 'ETERNITY' | 'YEAR' | 'YEAR_ROLLING' | 'MONTH'
): unknown {
  const period = getPeriod(periodType)
  if (period === UNDEFINED_PERIOD_TYPE) {
    console.error(`Variable '${answerKey}' de période imprévue ou inconnue: ${periodType}`)
    throw new UnknownPeriodError(answerKey)
  }

  let openfiscaVariableName = "statut_occupation_logement"
  if (answerValue == "logement-non-meuble"){
    return formatSurveyAnswerToRequest(openfiscaVariableName, period, 'locataire_vide')
  } else if (answerValue == "logement-meuble"){
    return formatSurveyAnswerToRequest(openfiscaVariableName, period, 'locataire_meuble')
  } else if (answerValue == "logement-foyer" ){
    return formatSurveyAnswerToRequest(openfiscaVariableName, period, 'locataire_foyer')
  } else {
    console.debug(`Valeur inattendue ${answerKey}: ${answerValue}`)
    throw new UnexpectedValueError(answerKey)
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
  openfiscaVariableName: string,
  period: string,
  value: boolean | number | string // VariableValueOnPeriod allowed types
): { [openfiscaKey: string]: VariableValueOnPeriod } {
  const result: { [key: string]: VariableValueOnPeriod } = {}
  result[openfiscaVariableName] = {
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

    const period = getPeriod(mapping.period)
    let formattedAnswer: { [openfiscaKey: string]: VariableValueOnPeriod } | undefined = undefined
    if ('dispatch' in mapping){
      // dispatch and manage period in dispatch
      formattedAnswer = mapping.dispatch(answerKey, answerValue, mapping.period) as { [openfiscaKey: string]: VariableValueOnPeriod }
    } else { 
      formattedAnswer = formatSurveyAnswerToRequest(mapping.openfiscaVariableName, period, answerValue)
    }
    
    const entityId = getEntityId(entity)
    if (entityId === UNDEFINED_ENTITY_ID) {
      console.error(`Variable '${answerKey}' d'entité imprévue ou inconnue: ${entity}`)
      throw new UnknownEntityError(answerKey)
    }

    let formattedVariableName = Object.keys(formattedAnswer)[0]
    if (request[entity][entityId][formattedVariableName]){
      // MANAGING VERY SPECIFIC CASE 🙀
      // a value already exists in the request for formattedVariableName 
      // we expect it to be at the same period as, for now, we set each variable once (for one period only)
      let existingValue = request[entity][entityId][formattedVariableName][period]
      if (formattedVariableName == 'statut_occupation_logement' && existingValue == 'locataire_vide') {
        // expected: one of dispatchSituationLogement or dispatchTypeLogement already updated the value once
        // we allow updates as 'locataire_vide' is kind of a default value for 'locataire'
        // (happens at least when dispatchSituationLogement is called before dispatchTypeLogement)
        console.warn(`Transcription mise à jour pour '${formattedVariableName}': '${existingValue}' suite input '${answerKey}': '${answerValue}'`)
        request[entity][entityId][formattedVariableName] = { ...formattedAnswer[formattedVariableName] }
      } else {
        // not one of the expected very specific cases :-o
        console.warn(`Valeur déjà existante pour '${formattedVariableName}': '${existingValue}'. Input complémentaire ignoré : '${answerKey}': '${answerValue}'`)
        throw new UnexpectedValueUpdateError(answerKey)
      }
    } else {
      // formattedVariableName value is set for the first time here
      request[entity][entityId][formattedVariableName] = { ...formattedAnswer[formattedVariableName] }
    }

    // MANAGING VERY SPECIFIC CASE 🙀
    if(formattedVariableName == 'statut_occupation_logement' && request[entity][entityId][formattedVariableName][period] == 'locataire_foyer'){
      // for the same entity Menage and at the same period than 'statut_occupation_logement' add 'logement_conventionne'
      const additionalOpenFiscaVariableName = 'logement_conventionne'
      const formattedAdditionalVariable = formatSurveyAnswerToRequest(additionalOpenFiscaVariableName, period, true)
      request[entity][entityId][additionalOpenFiscaVariableName] = { ...formattedAdditionalVariable[additionalOpenFiscaVariableName] }
    }
  }
  return request
}

/**
 * format a question to the openfisca web API
 * to calculate the variable defined in variableMapping
 */
function formatSurveyQuestionToRequest (
  openfiscaVariableName: string,
  period: string
) {
  const result: { [key: string]: VariableToCalculateOnPeriod } = {}
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
  const period = getPeriod(mapping.period)
  const formattedQuestion = formatSurveyQuestionToRequest(openfiscaVariableName, period)

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

  // TODO add additional information from gathered data? 
  // ex: logement_conventionne
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
  const config = useRuntimeConfig()

  // eslint-disable-next-line no-console
  console.debug(`Requête à transmettre à ${config.public.apiEndpointOpenFiscaFranceCalculate} :`)
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
