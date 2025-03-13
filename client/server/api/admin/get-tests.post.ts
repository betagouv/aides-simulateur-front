import fs from 'node:fs'
import path from 'node:path'
import { useRuntimeConfig } from '#imports'
import { createError, defineEventHandler, readBody } from 'h3'

export default defineEventHandler(async (event) => {
  // Utilise la variable d'environnement pour le mot de passe
  const config = useRuntimeConfig()
  const ADMIN_PASSWORD = config.adminPassword || ''

  try {
    // Vérification du mot de passe
    const body = await readBody(event)
    const password = body.password as string

    if (!ADMIN_PASSWORD || password !== ADMIN_PASSWORD) {
      throw createError({
        statusCode: 401,
        message: 'Non autorisé'
      })
    }

    // Chemin vers le fichier du formulaire contenant les tests
    const formsDir = path.resolve('./client/public/forms')
    const filePath = path.join(formsDir, 'demenagement-logement.json')

    // Vérifier si le fichier existe
    if (!fs.existsSync(filePath)) {
      throw createError({
        statusCode: 404,
        message: 'Fichier de formulaire contenant les tests non trouvé'
      })
    }

    // Lire le contenu du fichier
    const content = fs.readFileSync(filePath, 'utf8')

    try {
      // Parser le JSON
      const formData = JSON.parse(content)

      // Extraire les tests
      const tests = formData.tests || []

      return {
        success: true,
        data: tests
      }
    }
    catch {
      return {
        success: false,
        error: 'Erreur de parsing JSON',
        rawContent: content
      }
    }
  }
  catch (error: any) {
    console.error('Erreur lors de la récupération des tests:', error)

    if (error.statusCode) {
      throw error
    }

    return {
      success: false,
      error: 'Erreur lors de la récupération des tests'
    }
  }
})
