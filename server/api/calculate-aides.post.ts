import { buildRequest as buildOpenFiscaRequest } from '../helpers/openfisca-request'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { answers } = body

    if (!answers) {
      throw createError({
        statusCode: 400,
        message: 'Missing answers in request body'
      })
    }

    const config = useRuntimeConfig()
    const endpoint = config.public.apiEndpointOpenFiscaFranceCalculate
    const request = buildOpenFiscaRequest(answers)

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    })
    const result = await response.json()

    if (!response.ok) {
      throw createError({
        statusCode: response.status,
        message: result
      })
    }
    return {
      statusCode: 200,
      body: result
    }
  }
  catch (error) {
    throw createError({
      statusCode: 500,
      message: 'Failed to calculate aides',
      cause: error
    })
  }
})
