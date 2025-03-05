
// const API_ENDPOINT_OPENFISCA_FRANCE_CALCULATE: URL = new URL("/calculate", "http://127.0.0.1:5000")
const API_ENDPOINT_OPENFISCA_FRANCE_CALCULATE = new URL("/calculate", "https://aides-calculatrice-back.osc-fr1.scalingo.io")

const INDIVIDU_ID = "usager"
const MENAGE_ID = "menage_" + INDIVIDU_ID
const FOYER_FISCAL_ID = "foyer_fiscal_" + INDIVIDU_ID
const FAMILLE_ID = "famille_" + INDIVIDU_ID
const UNDEFINED_ENTITY_ID = "INCONNU"

enum Entites {
  Individus = "individus",
  Menages = "menages",
  FoyerFiscaux = "foyers_fiscaux",
  Familles = "familles"
}

type VariableValueOnPeriode = {
    [date: string]: number | boolean | string
}

// On VariableValueOnPeriode items, string[] is added to guarantee typing happiness
export type OpenFiscaFranceCalculation = {
  individus: {
    [name: string]: {
      [variable: string]: VariableValueOnPeriode
    }
  }
  menages: {
    [name: string]: {
      personne_de_reference: string[]
      conjoint: string[]
      enfants: string[]
      [variable: string]: string[] | VariableValueOnPeriode
    }
  }
  foyers_fiscaux: {
    [name: string]: {
      declarants: string[]
      personnes_a_charge: string[]
      [variable: string]: string[] | VariableValueOnPeriode
    }
  }
  familles: {
    [name: string]: {
      parents: string[]
      enfants: string[]
      [variable: string]: string[] | VariableValueOnPeriode
    }
  }
} | { error: string }

function initRequest() : OpenFiscaFranceCalculation {
  console.debug("initRequest...")
  let request: OpenFiscaFranceCalculation = {
    individus: {
      [INDIVIDU_ID]: {}
    },
    menages: {
      [MENAGE_ID]: {
        personne_de_reference: [ INDIVIDU_ID ],
        conjoint: [],
        enfants: []
      }
    },
    foyers_fiscaux: {
      [FOYER_FISCAL_ID]: {
        declarants: [ INDIVIDU_ID ],
        personnes_a_charge: []
      }
    },
    familles: {
      [FAMILLE_ID]: {
        parents: [ INDIVIDU_ID ],
        enfants: []
      }
    }
  }
  return request
}

// TODO type 'request' as OpenFiscaFranceCalculation?
function addEntityInputs(request: any, entity: Entites, entityId: string, inputs: SurveyAnswer[]): OpenFiscaFranceCalculation {
  console.debug(`addEntityInputs for ${entity}...`)

  const YEAR = "2025"
  const MONTH = YEAR + "-01"

  let requestWithInputs : OpenFiscaFranceCalculation = request
  console.debug(requestWithInputs[entity])
  console.debug(entityId)
  console.debug(`Données des personnes de la simulation : ${requestWithInputs[entity][entityId]}`)

  
  for (const inputKey in inputs){
    if (!requestWithInputs[entity][entityId][inputKey]) {
      requestWithInputs[entity][entityId][inputKey] = {};
    }
    requestWithInputs[entity][entityId][inputKey][MONTH] = inputs[inputKey];
  }
  
  console.debug(requestWithInputs)
  return requestWithInputs
}

function getEntityId(entity: Entites): string {
  switch(entity){
    case Entites.Individus:
      return INDIVIDU_ID
      
    case Entites.Menages:
      return MENAGE_ID
      
    case Entites.FoyerFiscaux:
      return FOYER_FISCAL_ID
      
    case Entites.Familles:
      return FAMILLE_ID
      
    default:
      console.error(`Entité inconnue: ${entity}`)
      return UNDEFINED_ENTITY_ID
  }
}

//TODO function buildRequest(answers: SurveyAnswer[]): OpenFiscaFranceCalculation { ?
export function buildRequest(answers: any): OpenFiscaFranceCalculation {
  console.debug("buildRequest...")  
  let request: OpenFiscaFranceCalculation = initRequest()
  console.debug(request)

  for (const entityKey in Entites) {
    const entityValue = entityKey as keyof typeof Entites
    const entity: Entites = Entites[entityValue]
    
    console.debug(`entity: ${entity}`)
    console.debug(`entityValue: ${entityValue}`)

    const entityId = getEntityId(entity)
    request = addEntityInputs(request, entity, entityId, answers)
  }
  return request
}

export async function fetchOpenFiscaFranceCalculation(
    request: OpenFiscaFranceCalculation,
  ): Promise<OpenFiscaFranceCalculation> {

    console.debug("fetchOpenFiscaFranceCalculation...")
    console.debug("request:")
    console.debug(request)
  
    const requestSettings = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
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
