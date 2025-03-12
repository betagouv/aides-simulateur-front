export const useResultsStore = defineStore('results', () => {
  const results = ref<{ [id: string]: OpenFiscaAidesCalculationResponse }> ({})

  const setResults = (simulateurId: string, data: OpenFiscaAidesCalculationResponse) => {
    results.value[simulateurId] = data
  }

  const getResults = (simulateurId: string) => {
    return results.value[simulateurId]
  }

  return {
    results,
    setResults,
    getResults
  }
}, {
  persist: true
})
