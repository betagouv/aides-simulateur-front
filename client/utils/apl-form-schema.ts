export const aplFormSchema: FormSchema = [
  {
    key: 'logement_conventionne',
    title: 'Le logement est-il conventionné ?',
    type: 'boolean',
    default: false,
  },
  /**
   * Pour le calcul de reduction_loyer_solidarite_plafond_ressources
   */
  {
    key: 'nb_parents',
    title: 'Combien de parents vivent dans le foyer ?',
    type: 'number',
    default: 0,
  },
  {
    key: 'al_nb_personnes_a_charge',
    title: 'Combien de personnes avez-vous à charge ?',
    type: 'number',
    default: 0,
  },
  {
    key: 'depcom',
    title: 'Quel est le code INSEE de votre commune de résidence ?',
    type: 'string',
    default: '75101',
  },
  {
    key: 'statut_occupation_logement',
    title: 'Quel est votre statut d’occupation du logement ?',
    type: 'string',
    default: 'locataire_hors_foyer',
    choices: statutsOccupationLogement,
  },
  /**
   * Pour le calcul de aide_logement_montant_brut
   */
  {
    key: 'handicap',
    title: 'Y a-t-il une personne en situation de handicap dans le foyer ?',
    type: 'boolean',
    default: false,
  },
  {
    key: 'logement_chambre',
    title: 'Le logement est-il considéré comme une chambre ?',
    type: 'boolean',
    default: false,
  },
  {
    key: 'coloc',
    title: 'Le logement est-il en colocation ?',
    type: 'boolean',
    default: false,
  },
  {
    key: 'logement_crous',
    title: 'Le logement est-il un logement CROUS ?',
    type: 'boolean',
    default: false,
  },
  {
    key: 'loyer',
    title: 'Quel est le montant du loyer mensuel ?',
    type: 'number',
    default: 0,
  },
  {
    key: 'aide_logement_base_ressources',
    title: 'Quel est le montant des ressources mensuelles ?',
    type: 'number',
    default: 0,
  },
]
