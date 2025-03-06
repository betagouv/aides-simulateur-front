// checked with openfisca-france v169.16.16 

let individus_variables_eternity = {
    "date_naissance": "date_naissance" // '2000-01-01'
}

let individus_variables_month = {
    "handicap": "handicap", // 'non-handicap' TODO: move to boolean value
    "salaire-imposable": "salaire_imposable", // '20000' TODO: move to month value or multiple month values?
    "situation-familiale": "statut_marital", // 'celibataire' 
    // TODO: update aides-simplifiee variable to "marital" instead of "familiale"
    // possible values: https://legislation.fr.openfisca.org/statut_marital
    "statut-professionnel": "activite" // 'salarie'
    // possible values: https://legislation.fr.openfisca.org/activite
}



let menages_variables_month = {
    "code-postal-nouvelle-ville": "depcom", // '75015'
    "colocation": "coloc", // 'colocation-non' TODO: move to boolean value
    "logement-chambre": "logement_chambre", // 'logement-chambre-non' TODO: move to boolean value
    "loyer-montant-charges": "charges_locatives", // for Garantie visale (not APL)
    "loyer-montant-mensuel": "loyer", // '700' TODO: move to number value
    "situation-logement": "statut_occupation_logement", // 'locataire'
    // possible values: https://legislation.fr.openfisca.org/statut_occupation_logement
    "type-logement": "logement_conventionne" // 'logement-foyer' TODO: check what we mean by "type-logement" (foyer, chambre... or conventionne / not conventionne)
}

let familles_variables_month = {
    "logement-parente-proprietaire": "proprietaire_proche_famille" // 'logement-parente-proprietaire-non' TODO: move to boolean value
}

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
