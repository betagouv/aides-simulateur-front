export interface Simulateur {
  id: string
  shortTitle: string
  pictogram: () => Promise<{ default: string }>
  title: string
}

export const simulateurs: Simulateur[] = [
  {
    id: 'demenagement-logement',
    shortTitle: 'Déménagement & logement',
    pictogram: () => import('@/assets/custom-pictograms/demenagement.svg'),
    title: 'Aides financières au déménagement et au logement',
  },
]
