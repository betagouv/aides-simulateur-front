import { getPeriod } from "./calculate-aides"

export function extractAidesResults(
    apiResponse: OpenFiscaCalculationResponse,
    resultsToExtract: string[]
): SimulationResultsAides {
    let results: SimulationResultsAides = {}    
    let questionMapping: OpenFiscaMapping
    let period: string

    resultsToExtract.forEach(questionKey => {    
        try {
            if (questionKey in individusQuestionsVariables){
                questionMapping = individusQuestionsVariables[questionKey]
                period = getPeriod(questionMapping.period)
                results[questionKey] = apiResponse[Entites.Individus][INDIVIDU_ID][questionMapping.openfiscaVariableName][period]
                
            } else if (questionKey in menagesQuestionsVariables){
                questionMapping = menagesQuestionsVariables[questionKey]
                period = getPeriod(questionMapping.period)
                results[questionKey] = apiResponse[Entites.Menages][MENAGE_ID][questionMapping.openfiscaVariableName][period]
            
            } else if (questionKey in famillesQuestionsVariables){
                questionMapping = famillesQuestionsVariables[questionKey]
                period = getPeriod(questionMapping.period)
                results[questionKey] = apiResponse[Entites.Familles][FAMILLE_ID][questionMapping.openfiscaVariableName][period]
            
            } else if (questionKey in foyersFiscauxQuestionsVariables){
                questionMapping = foyersFiscauxQuestionsVariables[questionKey]
                period = getPeriod(questionMapping.period)
                results[questionKey] = apiResponse[Entites.FoyerFiscaux][FOYER_FISCAL_ID][questionMapping.openfiscaVariableName][period]
            
            } else {
                console.error(`Variable de réponse à question du simulateur inconnue : ${questionKey}`)
                throw new UnknownVariableError(questionKey)
            }
        }
        catch (anyError) {
          console.error(`Réponse à question '${questionKey}' non transcrite dans les résultats de simulation suite à l'erreur '${anyError}'.`)
        }
    })

    console.warn(`Les questions suivantes étaient attendues mais n'ont pas été extraites de la réponse d'API : ${resultsToExtract.filter(key => !results.hasOwnProperty(key))}`)
    return results
}
