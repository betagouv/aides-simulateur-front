/**
 * Transforms raw aides data from OpenFisca into rich content for UI display
 */
export async function transformSimulationResults (
  calculationResponse: OpenFiscaAidesCalculationResponse,
  simulateurId: string
): Promise<RichSimulationResults> {
  const rawAides: RawAide[] = Object.entries(calculationResponse)
    .reduce((acc, [key, value]) => {
      if (key.match('-eligibilite')) {
        const eligibilite = value
        const aideId = key.replace('-eligibilite', '')
        if (eligibilite === true) {
          const montant = calculationResponse[aideId]
          if (montant && typeof montant === 'number') {
            acc.push({
              id: aideId,
              eligibilite: true,
              montant
            })
          }
        }
        else {
          acc.push({
            id: aideId,
            eligibilite: false
          })
        }
      }
      return acc
    }, [] as RawAide[])

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

  async function getRichAide (rawAide: RawAide): Promise<RichAide> {
    const aideDetails = await queryCollection('aides')
      .where('stem', '=', `aides/${rawAide.id}`)
      .first()

    const richAide: RichAide = {
      // Data from calculation response
      id: rawAide.id,
      montant: rawAide.montant || 0,
      link: `/simulateurs/${simulateurId}/resultats/${rawAide.id}`,
      eligibilite: rawAide.eligibilite,
      // Data from content source
      title: aideDetails?.titre || `Aide ${rawAide.id}`,
      description: aideDetails?.description || 'Description non disponible',
      textesLoi: aideDetails?.textesLoi || [],
      instructeur: aideDetails?.instructeur || 'Instructeur non disponible',
      type: aideDetails?.type || 'financements',
      resume: aideDetails?.resume || 'Résumé non disponible'
    }

    return richAide
  }

  // Process each aide and enrich with details
  const richAides = await Promise.all(
    rawAides.map(getRichAide)
  )

  // Group aides by eligibility
  const eligibleAides: RichAide[] = []
  const nonEligibleAides: RichAide[] = []
  richAides.forEach((richAide) => {
    if (richAide.eligibilite) {
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
  const textesDeLoi: string[] = []
  richAides.forEach((aide) => {
    textesDeLoi.push(...aide.textesLoi)
  })

  return {
    aides: eligibleAides,
    montants,
    echeances,
    aidesNonEligibles: nonEligibleAides,
    textesDeLoi
  }
}
