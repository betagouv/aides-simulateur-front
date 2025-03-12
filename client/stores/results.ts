export const useResultsStore = defineStore('results', () => {
  const results = ref<{ [id: string]: SimulationResultsAides }> ({})

  const setResults = (simulateurId: string, data: SimulationResultsAides) => {
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
