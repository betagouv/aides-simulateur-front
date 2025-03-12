// checked with openfisca-france v169.16.16

export interface OpenFiscaMapping {
  openfiscaVariableName: string
  period: 'ETERNITY' | 'YEAR' | 'MONTH'
}

export const individusVariables: { [aidesSimplifieesKey: string]: OpenFiscaMapping } = {
  'date_naissance': { // '2000-01-01'
    openfiscaVariableName: 'date_naissance',
    period: 'ETERNITY'
  },
  'handicap': { // 'non-handicap' TODO: move to boolean value
    openfiscaVariableName: 'handicap',
    period: 'MONTH'
  },
  'salaire-imposable': { // '20000' TODO: move to month value or multiple month values?
    openfiscaVariableName: 'salaire_imposable',
    period: 'MONTH'
  },
  'situation-familiale': { // 'celibataire'
    // TODO: update aides-simplifiee variable to "marital" instead of "familiale"
    // possible values: https://legislation.fr.openfisca.org/statut_marital
    openfiscaVariableName: 'statut_marital',
    period: 'MONTH'
  },
  'statut-professionnel': { // 'salarie'
    // possible values: https://legislation.fr.openfisca.org/activite
    openfiscaVariableName: 'activite',
    period: 'MONTH'
  }
}

export const menagesVariables: { [aidesSimplifieesKey: string]: OpenFiscaMapping } = {
  'code-postal-nouvelle-ville': { // '75015'
    openfiscaVariableName: 'depcom',
    period: 'MONTH'
  },
  'colocation': { // 'colocation-non' TODO: move to boolean value
    openfiscaVariableName: 'coloc',
    period: 'MONTH'
  },
  'logement-chambre': { // 'logement-chambre-non' TODO: move to boolean value
    openfiscaVariableName: 'logement_chambre',
    period: 'MONTH'
  },
  'loyer-montant-charges': { // for Garantie visale (not APL)
    openfiscaVariableName: 'charges_locatives',
    period: 'MONTH'
  },
  'loyer-montant-mensuel': { // '700' TODO: move to number value
    openfiscaVariableName: 'loyer',
    period: 'MONTH'
  },
  'situation-logement': { // 'locataire'
    // possible values: https://legislation.fr.openfisca.org/statut_occupation_logement
    openfiscaVariableName: 'statut_occupation_logement',
    period: 'MONTH'
  },
  'type-logement': { // 'logement-foyer' TODO: check what we mean by "type-logement" (foyer, chambre... or conventionne / not conventionne)
    openfiscaVariableName: 'logement_conventionne',
    period: 'MONTH'
  }
}

export const famillesVariables: { [aidesSimplifieesKey: string]: OpenFiscaMapping } = {
  'logement-parente-proprietaire': { // 'logement-parente-proprietaire-non' TODO: move to boolean value
    openfiscaVariableName: 'proprietaire_proche_famille',
    period: 'MONTH'
  }
}

export const foyersFiscauxVariables: { [aidesSimplifieesKey: string]: OpenFiscaMapping } = {}

// TODO check what these variables mean:
// confirmation-end
// {2025-01: 'confirmation-end-oui'}
//
// "situation-professionnelle": "stagiaire", // 'stage'
// but a 'stage' is among 'salarie' possibilities
// is 'stage' the only possible value here?
// check overlap with statut-professionnel and https://legislation.fr.openfisca.org/activite

// No need to map these variables:
// habitation-avec-autre-personnes
// {2025-01: 'habitation-avec-autre-personnes-non'}
//
// loyer-besoin-cautions
// {2025-01: 'loyer-besoin-cautions-oui'}
//
// loyer-besoin-garant
// {2025-01: 'loyer-besoin-garant-oui'}
//
// loyer-difficile-payer
// {2025-01: 'loyer-difficile-payer-oui'}
//
// nombre-personnes-logement
// {2025-01: '1'}
//
// type-revenus
// {2025-01: Proxy(Array)}
