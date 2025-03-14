const mockCalculationResponse = {
  'aide-personnalisee-logement': 1212.23,
  'aide-personnalisee-logement-eligibilite': true,
  'garantie-visale': 317.855,
  'garantie-visale-eligibilite': true,
  'locapass': 300.24,
  'locapass-eligibilite': true,
  'mobilite-master-1': 343.34,
  'mobilite-master-1-eligibilite': true,
  'mobilite-parcoursup': 200,
  'mobilite-parcoursup-eligibilite': false
}
/**
 * Transforms raw aides data from OpenFisca into rich content for UI display
 */
export async function transformSimulationResults (
  calculationResponse: SimulationResultsAides,
  createdAt: Date,
  simulateurId: string
): Promise<RichSimulationResults> {
  const simulationDateTime = formatDateTime(createdAt)
  /**
   * Uncomment below to use mock data for testing
   */
  // calculationResponse = mockCalculationResponse
  const rawAides: RawAide[] = Object.entries(mockCalculationResponse)
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
      createAt: simulationDateTime,
      aides: [],
      montants: [],
      echeances: [],
      aidesNonEligibles: [],
      textesLoi: []
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
      link: `/simulateurs/${simulateurId}/resultats/${rawAide.id}#simulateur-title`,
      eligibilite: rawAide.eligibilite,
      // Data from content source
      titre: aideDetails?.titre || `Aide ${rawAide.id}`,
      description: aideDetails?.description || 'Description non disponible',
      textesLoi: aideDetails?.textesLoi || [],
      instructeur: aideDetails?.instructeur || 'Instructeur non disponible',
      type: aideDetails?.type || '',
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
      switch (type) {
        case 'mensuelle':
          montantInfo.prefix = 'Jusqu\'à'
          montantInfo.suffix = 'par mois pour vous aider à payer votre loyer'
          break
        case 'pret':
          montantInfo.prefix = 'Jusqu\'à'
          montantInfo.suffix = 'prétés'
          break
        case 'caution':
          montantInfo.prefix = 'Jusqu\'à'
          montantInfo.suffix = 'de caution à rembourser en cas de dégâts'
          break
        case 'une-fois':
          montantInfo.prefix = 'Jusqu\'à'
          montantInfo.suffix = 'pour financer votre installation'
          break
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
  const textesLoi: TexteLoi[] = []
  richAides.forEach((aide) => {
    textesLoi.push(...aide.textesLoi)
  })

  return {
    createAt: simulationDateTime,
    aides: eligibleAides,
    montants,
    echeances,
    aidesNonEligibles: nonEligibleAides,
    textesLoi
  }
}
