/**
 * Mock database of aide details
 * In a real implementation, this would fetch data from an API or database
 */
const AIDES_DETAILS_MOCK: Record<string, AideDetails> = {
  'aide-1': {
    title: 'Prime de déménagement',
    description: 'Aide financière pour couvrir une partie des frais de déménagement pour les familles nombreuses',
    instructeur: 'Caisse d\'allocations familiales (CAF)',
    type: 'une-fois',
    resume: 'Cette aide est versée une seule fois pour vous aider à couvrir les frais de déménagement',
    textesDeLoi: ['Article L.542-8 du Code de la sécurité sociale', 'Arrêté du 12 décembre 2005']
  },
  'aide-2': {
    title: 'Aide personnalisée au logement (APL)',
    instructeur: 'Caisse d\'allocations familiales (CAF)',
    description: 'Aide financière destinée à réduire le montant de votre loyer ou mensualité d\'emprunt',
    type: 'periode',
    resume: 'Versée chaque mois pour vous aider à payer votre loyer ou remboursement de prêt'
  },
  'aide-3': {
    title: 'Avance Loca-Pass',
    instructeur: 'Action Logement',
    description: 'Prêt à 0% pour financer le dépôt de garantie demandé par le propriétaire',
    type: 'pret',
    resume: 'Prêt sans intérêt remboursable sur 25 mois maximum avec un différé de 3 mois'
  },
  'aide-4': {
    title: 'Crédit d\'impôt pour frais de déménagement',
    instructeur: 'Direction générale des finances publiques (DGFiP)',
    description: 'Réduction d\'impôt pour les frais de déménagement liés à une mobilité professionnelle',
    type: 'reduction-impots',
    resume: 'Crédit d\'impôt de 50% des dépenses engagées dans la limite de 1500€'
  }
}

/**
 * Get details for a specific aide by ID
 * @todo Replace with real implementation fetching data from nuxt-content
 */
export function getAideDetails (aideId: string): AideDetails | undefined {
  return AIDES_DETAILS_MOCK[aideId]
}

/**
 * Get formatted amount text based on aide type
 */
export function formatMontantByType (montant: number, type: TypeAide): string {
  switch (type) {
    case 'pret':
      return `${montant} € disponible`
    case 'periode':
      return `${montant} € / mois`
    case 'reduction-impots':
      return `Jusqu'à ${montant} €`
    default:
      return `${montant} €`
  }
}
