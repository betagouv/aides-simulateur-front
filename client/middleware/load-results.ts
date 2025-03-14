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
    try {
      const transformedData = await transformSimulationResults(results.data, new Date(results.meta.createdAt), simulateurId)
      return transformedData
    } catch (err) {
      console.error('Error transforming results:', err)
      throw err
    }
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
    console.error('Failed to get results:', error.value)
    return createError({
      statusCode: 500,
      message: 'Erreur lors de la récupération des résultats'
    })
  }
})
