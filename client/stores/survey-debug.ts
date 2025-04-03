export const useSurveyDebugStore = defineStore('survey-debug', () => {

  const debugMode = ref<boolean>(false)

  function toggleDebugMode() {
    debugMode.value = !debugMode.value
    // eslint-disable-next-line no-console
    console.log(`[FormStore] Debug mode ${debugMode.value ? 'enabled' : 'disabled'}`)
  }

  return {
    debugMode,
    toggleDebugMode
  }
})

