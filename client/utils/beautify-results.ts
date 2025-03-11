
const REQUESTED_MONTH_PERIOD = MONTH

export function extractAidesResults(
    apiResponse: OpenFiscaCalculationResponse,
    resultsToExtract: string[]
): ResultAide {
    let results: ResultAide = {}
    // for (const questionKey in resultsToExtract){
    //     try {
    //         if (questionKey in individusQuestionsVariables){
    //             const openfiscaVariableName = individusQuestionsVariables[questionKey].openfiscaVariableName
    //             results[questionKey] = apiResponse[Entities.Individus][INDIVIDU_ID][openfiscaVariableName][REQUESTED_MONTH_PERIOD]
    //         } else if (questionKey in menagesQuestionsVariables){
    //             const openfiscaVariableName = menagesQuestionsVariables[questionKey].openfiscaVariableName
    //             results[questionKey] = apiResponse[Entities.Menages][MENAGE_ID][openfiscaVariableName][REQUESTED_MONTH_PERIOD]
    //         } else if (questionKey in famillesQuestionsVariables){
    //             const openfiscaVariableName = famillesQuestionsVariables[questionKey].openfiscaVariableName
    //             results[questionKey] = apiResponse[Entities.Familles][FAMILLE_ID][openfiscaVariableName][REQUESTED_MONTH_PERIOD]
    //         } else if (questionKey in foyersFiscauxQuestionsVariables){
    //             const openfiscaVariableName = foyersFiscauxQuestionsVariables[questionKey].openfiscaVariableName
    //             results[questionKey] = apiResponse[Entities.FoyerFiscaux][FOYER_FISCAL_ID][openfiscaVariableName][REQUESTED_MONTH_PERIOD]
    //         } else {
    //             console.error(`Variable de réponse à question du simulateur inconnue : ${questionKey}`)
    //             throw new UnknownVariableError(questionKey)
    //         }
    //     }
    //     catch (anyError) {
    //       console.error(`Réponse à question '${questionKey}' non transcrite dans les résultats de simulation suite à l'erreur '${anyError}'.`)
    //     }
    // }
    
    results = {
        'locapass-eligibilite': true,
        'mobilite-master-1': 1000,
        'mobilite-parcoursup': 500,
        'aide-personnalisee-logement': 172.78,
        'garantie-visale-eligibilite': true,
        'garantie-visale': 1300  // maximum for one month != Ile de France 
    }
    return results
}
