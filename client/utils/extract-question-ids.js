import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

// Get current file's directory
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Path to the JSON file
const filePath = path.join(__dirname, '../public/forms/demenagement-logement.json')

// Read and parse the JSON file
try {
  const data = fs.readFileSync(filePath, 'utf8')
  const jsonData = JSON.parse(data)

  // Array to store all question IDs
  const questionIds = []

  // Extract question IDs from steps
  if (jsonData.steps && Array.isArray(jsonData.steps)) {
    jsonData.steps.forEach((step) => {
      if (step.questions && Array.isArray(step.questions)) {
        step.questions.forEach((question) => {
          if (question.id) {
            questionIds.push(question.id)
          }
        })
      }
    })
  }

  // Extract question IDs from triggeredQuestions
  if (jsonData.triggeredQuestions && Array.isArray(jsonData.triggeredQuestions)) {
    jsonData.triggeredQuestions.forEach((question) => {
      if (question.id) {
        questionIds.push(question.id)
      }
    })
  }

  // Output the results
  console.warn('Question IDs:')
  console.warn(questionIds)
  console.warn(`Total questions found: ${questionIds.length}`)
}
catch (error) {
  console.error('Error reading or parsing the JSON file:', error)
}
