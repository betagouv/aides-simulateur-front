
// const API_ENDPOINT_OPENFISCA_FRANCE_CALCULATE: URL = new URL("/calculate", "http://127.0.0.1:5000")
const API_ENDPOINT_OPENFISCA_FRANCE_CALCULATE = new URL("/calculate", "https://aides-calculatrice-back.osc-fr1.scalingo.io")

const INDIVIDU_ID = "usager"
const MENAGE_ID = "menage_" + INDIVIDU_ID
const FOYER_FISCAL_ID = "foyer_fiscal" + INDIVIDU_ID
const FAMILLE_ID = "famille_" + INDIVIDU_ID

enum Entites {
  Individus = "individus",
  Menages = "menages",
  FoyerFiscaux = "foyers_fiscaux",
  Familles = "familles"
}

type VariableValueOnPeriode = {
    [date: string]: number | boolean | string
}


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
      [variable: string]: string[] | VariableValueOnPeriode   // should be VariablePeriod only
    }
  }
} | { error: string }

function initRequest() : OpenFiscaFranceCalculation{
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
  const YEAR = "2025"
  const MONTH = YEAR + "-01"
  const ENTITY_STRING: string = entity.toString()
  

  let requestWithInputs : OpenFiscaFranceCalculation = request
  console.debug(requestWithInputs[ENTITY_STRING][entityId])

  for (const inputKey in inputs){
    if (!requestWithInputs[ENTITY_STRING][entityId][inputKey]) {
      requestWithInputs[ENTITY_STRING][entityId][inputKey] = {};
    }
    requestWithInputs[ENTITY_STRING][entityId][inputKey][MONTH] = inputs[inputKey];
  }
  
  console.debug(requestWithInputs)
  return requestWithInputs
}


//TODO function buildRequest(answers: SurveyAnswer[]): OpenFiscaFranceCalculation { ?
export function buildRequest(answers: any): OpenFiscaFranceCalculation {
  let request: OpenFiscaFranceCalculation = initRequest()
  request = addEntityInputs(request, Entites.Individus, INDIVIDU_ID, answers)
  return request
}

export async function fetchOpenFiscaFranceCalculation(
    request: OpenFiscaFranceCalculation,
  ): Promise<OpenFiscaFranceCalculation> {

    console.log("fetchOpenFiscaFranceCalculation...")
    console.log(request)
  
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
