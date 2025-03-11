import fs from 'node:fs'
import path from 'node:path'
import { defineEventHandler, readBody } from 'h3'

// Create a directory for storing form data if it doesn't exist
const dataDir = path.resolve('./data/form-submissions')
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

export default defineEventHandler(async (event) => {
  try {
    // Read the request body
    const body = await readBody(event)
    const { answers, results, simulateurId } = body

    if (!answers || !results || !simulateurId) {
      return {
        success: false,
        error: 'Missing required data: answers, results, or simulateurId'
      }
    }

    // Generate a unique filename based on timestamp and a random string
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const randomStr = Math.random().toString(36).substring(2, 8)
    const filename = `${simulateurId}_${timestamp}_${randomStr}.json`

    // Create the full file path
    const filePath = path.join(dataDir, filename)

    // Store the data as JSON
    const dataToStore = {
      timestamp: new Date().toISOString(),
      simulateurId,
      answers,
      results
    }

    fs.writeFileSync(filePath, JSON.stringify(dataToStore, null, 2))

    return {
      success: true,
      filename
    }
  }
  catch (error) {
    console.error('Error storing form data:', error)
    return {
      success: false,
      error: 'Failed to store form data'
    }
  }
})
