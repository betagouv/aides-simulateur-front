/**
 * Transforms raw aides data from OpenFisca into rich content for UI display
 */
export function transformSimulationResults (
  rawAides: RawAide[],
  simulateurId: string
): RichSimulationResults {
  // Handle empty input case
  if (!rawAides || rawAides.length === 0) {
    return {
      aides: [],
      montants: [],
      echeances: [],
      aidesNonEligibles: [],
      textesDeLoi: []
    }
  }

  // Group aides by eligibility
  const eligibleAides: RichAide[] = []
  const nonEligibleAides: RichAide[] = []

  // Process each aide and enrich with details
  rawAides.forEach((rawAide) => {
    /**
     * We'll need to fetch details for each aide from nuxt-content
     * once we have wrote every aide's file
     */
    const aideDetails = getAideDetails(rawAide.id)

    const richAide: RichAide = {
      id: rawAide.id,
      link: `/simulateurs/${simulateurId}/${rawAide.id}`,
      title: aideDetails?.title || `Aide ${rawAide.id}`,
      description: aideDetails?.description || 'Description non disponible',
      montant: rawAide.montant || 0,
      instructeur: aideDetails?.instructeur || 'Instructeur non disponible',
      type: aideDetails?.type || 'financements',
      resume: aideDetails?.resume || 'Résumé non disponible'
    }

    if (rawAide.eligibilite) {
      eligibleAides.push(richAide)
    }
    else {
      nonEligibleAides.push(richAide)
    }
  })

  // Calculate montant summaries by type
  const montantsByType = new Map<TypeAide, number>()
  eligibleAides.forEach((aide) => {
    const currentTotal = montantsByType.get(aide.type) || 0
    montantsByType.set(aide.type, currentTotal + aide.montant)
  })

  // Transform to rich montants
  const montants: RichMontant[] = Array
    .from(montantsByType.entries())
    .map(([type, montant]) => {
      const montantInfo: RichMontant = {
        type,
        montant
      }

      // Add specific formatting based on aide type
      if (type === 'reduction-impots') {
        montantInfo.prefix = 'Jusqu\'à'
      }
      else if (type === 'pret') {
        montantInfo.suffix = 'disponible'
      }

      return montantInfo
    })

  // Mock echeances - in real implementation, this would be derived from data
  const echeances: RichEcheance[] = eligibleAides
    .filter(aide => aide.type === 'periode')
    .map(aide => ({
      type: aide.type,
      montant: aide.montant,
      dateStart: new Date(),
      dateEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
    }))

  // Sample texts - would come from a real data source
  const textesDeLoi = eligibleAides.length > 0
    ? ['Article L.123-4 du Code de l\'action sociale', 'Décret n°2021-123 du 15 février 2021']
    : []

  return {
    aides: eligibleAides,
    montants,
    echeances,
    aidesNonEligibles: nonEligibleAides,
    textesDeLoi
  }
}
