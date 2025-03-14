/**
 * This will make sure results are loaded when navigating to a simulateur results page
 */
export default defineNuxtRouteMiddleware(async (to) => {
  const simulateurId = to.params.simulateur_id as string
  const resultsStore = useResultsStore()
  const results = resultsStore.getResults(simulateurId)
  if (!results) {
    return navigateTo(`/simulateurs/${simulateurId}#simulateur-title`)
  }

  const { data, error } = await useAsyncData(`rich-results-${simulateurId}`, async () => {
    return transformSimulationResults(results.data, new Date(results.meta.createdAt), simulateurId)
  }, {
    default: () => ({
      aides: [],
      montants: [],
      echeances: [],
      aidesNonEligibles: [],
      textesLoi: []
    })
  })

  if (!data.value || error.value) {
    return createError({
      statusCode: 500,
      message: 'Erreur lors de la récupération des résultats'
    })
  }
})
