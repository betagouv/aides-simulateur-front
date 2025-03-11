import fs from 'node:fs'
import path from 'node:path'
import { useRuntimeConfig } from '#imports'
import { createError, defineEventHandler, getQuery } from 'h3'

export default defineEventHandler(async (event) => {
  // Utilise la variable d'environnement pour le mot de passe
  const config = useRuntimeConfig()
  const ADMIN_PASSWORD = config.adminPassword || ''

  try {
    // Vérification du mot de passe
    const query = getQuery(event)
    const password = query.password as string
    const filename = query.filename as string

    if (!ADMIN_PASSWORD || password !== ADMIN_PASSWORD) {
      throw createError({
        statusCode: 401,
        message: 'Non autorisé'
      })
    }

    if (!filename) {
      throw createError({
        statusCode: 400,
        message: 'Nom de fichier requis'
      })
    }

    // S'assurer que le fichier demandé est bien dans le répertoire des soumissions
    // et qu'il s'agit d'un fichier JSON (sécurité contre les attaques de traversée de chemin)
    if (!filename.endsWith('.json') || filename.includes('/') || filename.includes('\\')) {
      throw createError({
        statusCode: 400,
        message: 'Nom de fichier invalide'
      })
    }

    // Chemin vers le répertoire des soumissions
    const dataDir = path.resolve('./data/form-submissions')
    const filePath = path.join(dataDir, filename)

    // Vérifier si le fichier existe
    if (!fs.existsSync(filePath)) {
      throw createError({
        statusCode: 404,
        message: 'Fichier non trouvé'
      })
    }

    // Lire le contenu du fichier
    const content = fs.readFileSync(filePath, 'utf8')

    try {
      // Parser le JSON
      const data = JSON.parse(content)
      return {
        success: true,
        data
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
    console.error('Erreur lors de la récupération du fichier:', error)

    if (error.statusCode) {
      throw error
    }

    return {
      success: false,
      error: 'Erreur lors de la récupération du fichier'
    }
  }
})
