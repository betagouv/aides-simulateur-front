/**
 * Composable for loading and managing survey schema
 */
export function useSurveySchema () {
  const schema = ref<SurveySchema | null>(null)
  const state = ref<'idle' | 'loading' | 'error' | 'success'>('idle')
  const versions = ref<Record<string, string>>({})

  // Get debug mode from the debug store
  const { debugMode } = storeToRefs(useSurveyDebugStore())

  /**
   * Load survey schema from a JSON file
   */
  async function load (formId: string) {
    try {
      state.value = 'loading'
      const response = await fetch(`/forms/${formId}.json`)

      if (!response.ok) {
        throw new Error(`Failed to load schema: ${response.status} ${response.statusText}`)
      }

      const newSchema = await response.json() as SurveySchema
      // Check if we need to reset the form based on version and forceRefresh
      const storedVersion = versions.value[formId]
      const newVersion = newSchema.version

      const needsReset = (
        newSchema.forceRefresh
        || !storedVersion
        || compareVersions(newVersion, storedVersion) > 0
      )

      // Store the new version
      versions.value[formId] = newVersion

      schema.value = newSchema

      if (debugMode.value) {
        // eslint-disable-next-line no-console
        console.log('[useSurveySchema] Loaded survey schema:', newSchema)
      }

      state.value = 'success'

      return {
        needsReset
      }
    }
    catch (error) {
      state.value = 'error'
      console.error('[useSurveySchema] Error loading survey schema:', error)
      return {
        schema: null,
        needsReset: false,
        error
      }
    }
  }

  return {
    schema,
    state,
    versions,
    load
  }
}
