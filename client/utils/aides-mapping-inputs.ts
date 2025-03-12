// mapping client/public/forms/demenagement-logement.json
// to aides-calculatrice-back (openfisca-france here)
// checked with openfisca-france v169.16.16

export const individusVariables: { [aidesSimplifieesKey: string]: AidesSimplifieesMapping } = {
  'date-naissance': { // '2000-01-01'
    openfiscaVariableName: 'date_naissance',
    period: 'ETERNITY'
  },
  'handicap': { // 'non-handicap' TODO: move to boolean value
    openfiscaVariableName: 'handicap',
    period: 'MONTH'
  },
  'boursier': {
    openfiscaVariableName: 'boursier',
    period: 'MONTH'
  },
  'bourse-montant': {
    openfiscaVariableName: 'bourse_criteres_sociaux',
    // TODO dispatch to bourse_enseignement_sup, bourse_criteres_sociaux and bourse_lycee
    // according to user other inputs?
    period: 'MONTH'
  },
  'salaire-imposable': { // '20000' TODO: move to month value or multiple month values?
    openfiscaVariableName: 'salaire_imposable',
    period: 'MONTH'
  },
  'revenus-chomage': { // imposable
    openfiscaVariableName: 'chomage_imposable',
    period: 'MONTH'
  },
  'abattement-indemnite-chomage': {
    // TODO delete key as amount might already be removed from salaire-imposable that we need?
    openfiscaVariableName: 'aide_logement_abattement_indemnites_chomage',
    period: 'MONTH'
  },
  'retraites-imposables': { // TODO do not use plural id for the revenue of 1 person?
    openfiscaVariableName: 'retraite_imposable',
    period: 'MONTH'
  },
  'complement-allocation-divers': {
    // TODO check who needs this and if the description is right: 
    // Compléments divers (ex. allocation logement, allocations familiales, 
    // complément familial, allocation d'éducation de l'enfant handicapé (AEEH), 
    // allocation de soutien familial, allocation journalière de présence parentale (AJPP)).
    exclude: true
  },
  'pensions-alimentaires-recues': {
    openfiscaVariableName: 'pensions_alimentaires_percues',
    period: 'MONTH'
  },
  'pensions-alimentaires': {
    //TODO duplicates pensions-alimentaires-recues ; or should it be "versées"?
    exclude: true
  },
  'moins-values': {
    //TODO dispatch to moins_values_court_terme_non_salaries and moins_values_long_terme_non_salaries
    openfiscaVariableName: 'moins_values_court_terme_non_salaries',
    period: 'MONTH'
  },
  'revenus-conjoint': { // (number)
    // TODO remove as duplicates ressources-conjoint?
    exclude: true
  },
  'ressources-conjoint': {
    exclude: true
  },
  'revenus-independant': {
    //TODO check if it's imposable as mapped here
    openfiscaVariableName: 'rpns_imposables',
    period: 'MONTH'
  },
  'pensions-invalidite': {
    openfiscaVariableName: 'pensions_invalidite',
    period: 'MONTH'
  },
  'ressources-parents': {
    //TODO add people and define the right type of revenue to set
    exclude: true
  },
  'statut-marital': { // 'celibataire'
    openfiscaVariableName: 'statut_marital',
    // no need for dispatch - simulator choices are already equal to openfisca enum
    // possible values: https://legislation.fr.openfisca.org/statut_marital
    period: 'MONTH'
  },
  'statut-professionnel': { // 'salarie'
    // no need for dispatch - simulator choices are already equal to openfisca enum
    // possible values: https://legislation.fr.openfisca.org/activite
    openfiscaVariableName: 'activite',
    period: 'MONTH'
  },
  'situation-professionnelle': { // "salarie-hors-alternance"
    dispatch: dispatchSituationProfessionnelle,
    period: 'MONTH'
    // TODO: check 'situation-professionnelle' values as some also match 'statut-professionnel' values
  },
  'habitation-avec-autre-personnes': { // false
    exclude: true
  },
  'habiter-avec-conjoint': { // false
    exclude: true
  },
  'nombre-personnes-logement': { // int
    exclude: true
  },
  'type-revenus': { // checkbox => multiple choices
    exclude: true
  },
  'etudiant-mobilite': {
    exclude: true
  },
  'loyer-difficile-payer': { // true
    // TODO: link to APL calculation?
    exclude: true
  },
  'loyer-besoin-garant': { // true
    // TODO: link to Garantie visale calculation?
    exclude: true
  },
  'loyer-besoin-cautions': {
    // TODO: link to Locapass calculation?
    exclude: true
  },
  'confirmation-end': {
    // end of survey
    exclude: true
  }
}

export const menagesVariables: { [aidesSimplifieesKey: string]: AidesSimplifieesMapping } = {
  'code-postal-nouvelle-ville': { // '75015' code INSEE
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
    dispatch: dispatchSituationLogement,
    period: 'MONTH'
  },
  'primo-accedant': {
    // TODO: include in situation-logement?
    exclude: true
  },
  'type-logement': { // 'logement-foyer' TODO: check what we mean by "type-logement" (foyer, chambre... or conventionne / not conventionne)
    dispatch: dispatchTypeLogement,
    period: 'MONTH'
  }
}

export const famillesVariables: { [aidesSimplifieesKey: string]: AidesSimplifieesMapping } = {
  'logement-parente-proprietaire': { // 'logement-parente-proprietaire-non' TODO: move to boolean value
    openfiscaVariableName: 'proprietaire_proche_famille',
    period: 'MONTH'
  },
  'revenus-patrimoine': {
    openfiscaVariableName: 'revenus-patrimoine',
    period: 'MONTH'
  }
}

export const foyersFiscauxVariables: { [aidesSimplifieesKey: string]: AidesSimplifieesMapping } = {}
