import { useRuntimeConfig } from '#imports'
import { defineEventHandler, readBody } from 'h3'

export default defineEventHandler(async (event) => {
  try {
    // Get the JSON body from the request
    const requestBody = await readBody(event)

    // Get OpenFisca API URL from server config
    const config = useRuntimeConfig()
    const openFiscaUrl = config.apiEndpointOpenFiscaFranceCalculate as string
    console.log('openFiscaUrl +++++++ ', openFiscaUrl)
    // Make request to OpenFisca API
    const response = await fetch(openFiscaUrl, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })

    // Get the response
    const result = await response.json()

    // Return error if the response is not OK
    if (!response.ok) {
      console.error('Error from OpenFisca API:', result)
      return {
        error: response.status,
        message: result
      }
    }

    // Return the result
    return result
  }
  catch (error) {
    console.error('Error in OpenFisca calculation API:', error)
    return {
      error: 500,
      message: 'Internal Server Error'
    }
  }
})
