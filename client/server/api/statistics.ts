import { queryCollectionNavigation } from '#imports'
import axios from 'axios'
import { defineEventHandler } from 'h3'

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig()

    // Check if config exists and has the matomo property
    if (!config || !config.matomo) {
      console.error('Runtime config is missing or invalid:', config)
      event.node.res.statusCode = 500
      return { error: 'Invalid runtime configuration' }
    }

    const MATOMO_URL = config.matomo.url?.replace(/\/$/, '') // Remove trailing slash if present
    const MATOMO_TOKEN = config.matomo.token
    const MATOMO_SITE_ID = config.matomo.siteId

    console.warn('Matomo configuration:', {
      url: MATOMO_URL,
      siteId: MATOMO_SITE_ID,
      hasToken: !!MATOMO_TOKEN
    })

    if (!MATOMO_URL || !MATOMO_TOKEN || !MATOMO_SITE_ID) {
      console.error('Missing Matomo configuration:', {
        url: MATOMO_URL,
        siteId: MATOMO_SITE_ID,
        hasToken: !!MATOMO_TOKEN
      })
      event.node.res.statusCode = 500
      return { error: 'Missing Matomo configuration' }
    }

    // Get all events for the last 30 days
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - 30)

    const url = `${MATOMO_URL}/index.php`
    const params = {
      module: 'API',
      method: 'Events.getAction',
      idSite: MATOMO_SITE_ID,
      period: 'range',
      date: `${startDate.toISOString().split('T')[0]},${endDate.toISOString().split('T')[0]}`,
      format: 'JSON'
    }

    // Get aides data with error handling
    let aideIds: (string | undefined)[] = []
    try {
      const aidesData = await queryCollectionNavigation('aides', ['titre', 'type', 'montant', 'description', 'instructeur'])
      const aides = aidesData?.[0]?.children || []
      aideIds = aides.map(aide => aide.path.split('/').pop())
      console.warn('Found aide IDs:', aideIds)
    }
    catch (contentError) {
      console.error('Error fetching aides data:', contentError)
      // Continue with empty aideIds instead of failing completely
    }

    console.warn('Making Matomo API request:', {
      url,
      params: { ...params },
      hasToken: !!MATOMO_TOKEN
    })

    const response = await axios.post(url, {
      ...params,
      token_auth: MATOMO_TOKEN
    }, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      transformRequest: [(data) => {
        return Object.keys(data)
          .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
          .join('&')
      }]
    })

    console.warn('Matomo API response:', {
      status: response.status,
      hasData: !!response.data,
      dataType: typeof response.data,
      isArray: Array.isArray(response.data),
      rawData: response.data
    })

    const statistics: Record<string, { starts: number, completions: number }> = {}

    // Initialize statistics for all aides
    aideIds.forEach((id) => {
      if (id) {
        statistics[id] = { starts: 0, completions: 0 }
      }
    })

    // Process the events data
    let eventsData = response.data
    if (typeof eventsData === 'string') {
      try {
        eventsData = JSON.parse(eventsData)
      }
      catch (e) {
        console.error('Failed to parse Matomo response:', e)
        return statistics
      }
    }

    if (eventsData && Array.isArray(eventsData)) {
      console.warn('Processing events:', eventsData)

      // Create a default simulator ID since we're not getting specific IDs in the events
      const defaultSimulatorId = 'default-simulator'
      if (!statistics[defaultSimulatorId]) {
        statistics[defaultSimulatorId] = { starts: 0, completions: 0 }
      }

      eventsData.forEach((event: any) => {
        console.warn('Processing event:', {
          label: event.label,
          segment: event.segment,
          nb_events: event.nb_events
        })

        if (event.label === 'Start') {
          statistics[defaultSimulatorId].starts += event.nb_events
        }
        else if (event.label === 'Submit') {
          statistics[defaultSimulatorId].completions += event.nb_events
        }
      })
    }

    console.warn('Final processed statistics:', statistics)
    return statistics
  }
  catch (error: any) {
    console.error('Error in statistics endpoint:', error)
    event.node.res.statusCode = 500
    return {
      error: 'Failed to fetch statistics',
      details: error.message
    }
  }
})
