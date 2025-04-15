import { useRuntimeConfig } from '#imports'
import { defineEventHandler, getQuery } from 'h3'

export default defineEventHandler(async (event) => {
  // Get query parameters from the request
  const query = getQuery(event)
  const q = query.q as string

  if (!q) {
    return { suggestions: [] }
  }

  // Get config
  const config = useRuntimeConfig()
  const leximpactUrl = config.leximpactUrl

  try {
    // Make request to leximpact service
    const response = await fetch(
      `${leximpactUrl}/communes/autocomplete?q=${encodeURIComponent(q)}&field=commune&field=distributions_postales`,
      {
        headers: {
          'Accept': 'application/json',
          'X-Client-ID': 'aides-simplifiees'
        }
      }
    )

    console.log(`${leximpactUrl}/communes/autocomplete?q=${encodeURIComponent(q)}&field=commune&field=distributions_postales`)

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`)
    }

    // Return the result
    return await response.json()
  }
  catch (error) {
    console.error('Error fetching communes:', error)
    return { suggestions: [] }
  }
})
