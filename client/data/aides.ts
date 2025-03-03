export interface Aide {
  id: string
  title: string
  description: string
  type: TypeAide
  montant?: number
}

export const aides: Aide[] = [
  {
    id: 'garantie-visale',
    title: 'Visale',
    description: 'Visale est une garantie de caution locative gratuite',
    type: 'caution',
    montant: 1200,
  },
  {
    id: 'FSL',
    title: 'FSL',
    description: 'Fonds de solidarité pour le logement',
    type: 'une-fois',
    montant: 500,
  },
  {
    id: 'loca-pass',
    title: 'Avance Loca-pass',
    description: 'Avance gratuite du dépôt de garantie',
    type: 'periode',
    montant: 500,
  },
]
