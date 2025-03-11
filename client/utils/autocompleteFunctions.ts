/**
 * Fonctions d'autocomplétion pour les formulaires
 */

/**
 * Récupère les suggestions de communes et codes postaux depuis l'API
 * @param query - La requête de recherche
 * @returns Un tableau de suggestions
 */
export async function getInseeNumber (query: string) {
  try {
    // Encodage de la requête pour l'URL
    const encodedQuery = encodeURIComponent(query)

    // Appel à l'API avec la requête
    const response = await fetch(
      `https://territoires.leximpact.dev/communes/autocomplete?q=${encodedQuery}&field=commune&field=distributions_postales`,
      {
        headers: {
          'Accept': 'application/json',
          'X-Client-ID': 'aides-simplifiees'
        }
      }
    )

    // Si la réponse n'est pas OK, lever une erreur
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`)
    }

    // Extraction des données JSON
    const { suggestions } = await response.json()
    return suggestions || []
  }
  catch (error) {
    console.error('Erreur lors de la récupération des suggestions:', error)
    return [] // En cas d'erreur, retourner un tableau vide
  }
}

// Vous pouvez ajouter d'autres fonctions d'autocomplétion ici
export const autocompleteFunctions: Record<string, (query: string) => Promise<any[]>> = {
  getInseeNumber
}
