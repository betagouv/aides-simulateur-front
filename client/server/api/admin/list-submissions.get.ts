import fs from 'node:fs'
import path from 'node:path'
import { useRuntimeConfig } from '#imports'
import { createError, defineEventHandler, getQuery } from 'h3'

export default defineEventHandler(async (event) => {
  // Utilise la variable d'environnement pour le mot de passe
  // En développement, configurez un fichier .env à la racine du projet
  // En production, configurez la variable d'environnement sur votre serveur
  const config = useRuntimeConfig()
  const ADMIN_PASSWORD = config.adminPassword || ''

  console.log('Admin Password from env:', process.env.NUXT_ADMIN_PASSWORD)
  console.log('Admin Password from env:', process.env.ADMIN_PASSWORD)
  console.log('Admin Password from config:', useRuntimeConfig().adminPassword)

  try {
    // Vérification du mot de passe
    const query = getQuery(event)
    const password = query.password as string

    if (!ADMIN_PASSWORD || password !== ADMIN_PASSWORD) {
      throw createError({
        statusCode: 401,
        message: 'Non autorisé'
      })
    }

    // Chemin vers le répertoire des soumissions
    const dataDir = path.resolve('./data/form-submissions')

    // Vérifier si le répertoire existe
    if (!fs.existsSync(dataDir)) {
      return {
        success: true,
        files: []
      }
    }

    // Lire les fichiers du répertoire
    const files = fs.readdirSync(dataDir)
      .filter(filename => filename.endsWith('.json'))
      .map((filename) => {
        const filePath = path.join(dataDir, filename)
        const stats = fs.statSync(filePath)

        return {
          filename,
          timestamp: stats.mtime,
          size: stats.size
        }
      })

    // Trier par date de modification (les plus récents d'abord)
    files.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())

    // Limiter à 100 fichiers
    const limitedFiles = files.slice(0, 100)

    return {
      success: true,
      files: limitedFiles
    }
  }
  catch (error: any) {
    console.error('Erreur lors de la récupération des fichiers:', error)

    if (error.statusCode === 401) {
      throw error
    }

    return {
      success: false,
      error: 'Erreur lors de la récupération des fichiers'
    }
  }
})
