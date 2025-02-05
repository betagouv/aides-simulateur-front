/**
 * @see https://legislation.fr.openfisca.org/statut_occupation_logement
 */
export const statutsOccupationLogement: ChoiceItem[] = [
  {
    value: 'locataire_foyer',
    label: 'Locataire d\'un foyer (résidence universitaire, maison de retraite, foyer de jeune travailleur, résidence sociale...)',
  },
  {
    value: 'locataire_hlm',
    label: 'Locataire d\'un logement HLM',
  },
  {
    value: 'locataire_meuble',
    label: 'Locataire ou sous-locataire d\'un logement loué meublé ou d\'une chambre d\'hôtel',
  },
  {
    value: 'locataire_vide',
    label: 'Locataire ou sous-locataire d\'un logement loué vide non-HLM',
  },
  {
    value: 'loge_gratuitement',
    label: 'Logé gratuitement par des parents, des amis ou l\'employeur',
  },
  {
    value: 'non_renseigne',
    label: 'Non renseigné',
  },
  {
    value: 'primo_accedant',
    label: 'Accédant à la propriété',
  },
  {
    value: 'proprietaire',
    label: 'Propriétaire (non accédant) du logement',
  },
  {
    value: 'sans_domicile',
    label: 'Sans domicile stable',
  }
]
