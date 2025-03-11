declare global {

  type TypeAide = 'pret' | 'garantie' | 'caution' | 'periode' | 'une-fois' | 'reduction-impots' | 'aide-materielle' | 'financements'

  type ResultAide = { [aidesSimplifieesKey: string]: boolean | number }

}

export {}
