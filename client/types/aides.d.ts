declare global {

  type TypeAide = 'pret' | 'garantie' | 'caution' | 'periode' | 'une-fois' | 'reduction-impots' | 'aide-materielle' | 'financements' | 'mensuelle'

  interface SimulationResultsAides { [aidesSimplifieesKey: string]: boolean | number }

  interface RawAide {
    id: string
    eligibilite: boolean
    montant?: number
  }

  interface AideDetails {
    title: string
    description: string
    type: TypeAide
    instructeur: string
    description: string
    textesDeLoi?: string[]
  }

  interface RichAide {
    id: string
    link: string
    titre: string
    description: string
    eligibilite: boolean
    instructeur: string
    montant: number
    type: TypeAide
    textesLoi: string[]
    description: string
  }

  interface RichMontant {
    type: TypeAide
    montant: number
    prefix?: string
    suffix?: string
  }

  interface RichEcheance {
    type: TypeAide
    montant: number
    dateStart: Date // Changed from 'date' to 'Date'
    dateEnd: Date // Changed from 'date' to 'Date'
  }

  interface RichSimulationResults {
    aides: RichAide[]
    montants: RichMontant[]
    echeances: RichEcheance[]
    aidesNonEligibles: RichAide[]
    textesDeLoi: string[]
  }
}

export {}
