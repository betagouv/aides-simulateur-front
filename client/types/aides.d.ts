declare global {

  type TypeAide = 'pret' | 'garantie' | 'caution' | 'periode' | 'une-fois' | 'reduction-impots' | 'aide-materielle' | 'financements'

  interface AideContent {
    id: string
    title: string
    description: string
    montant: number
    type: TypeAide
    resume: string
  }
}

export {}
