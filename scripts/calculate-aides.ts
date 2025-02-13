
const API_URL_OPENFISCA_FRANCE = "http://127.0.0.1:5000"
const API_ENDPOINT_OPENFISCA_FRANCE = "calculate"


type VariablePeriode = {
    [date: string]: number | boolean | string
}

type OpenFiscaFranceCalculate = {
    individus: {
        [key: string]: VariablePeriode
    }
    menages: {
        [key: string]: VariablePeriode
    }
    foyers_fiscaux: {
        [key: string]: VariablePeriode
    }
    familles: {
        [key: string]: VariablePeriode
    }
} | { error: string }



export async function fetchOpenFiscaFranceCalculate(
    request: OpenFiscaFranceCalculate,
  ): Promise<OpenFiscaFranceCalculate> {

    console.log("fetchOpenFiscaFranceCalculate...")
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
        API_URL_OPENFISCA_FRANCE + "/" + API_ENDPOINT_OPENFISCA_FRANCE,
      requestSettings,
    )
  
    let result = undefined
    if (!response.ok) {
      result = { error: response.status }
    } else {
      result = await response.json()
    }
  
    return result
  }
  