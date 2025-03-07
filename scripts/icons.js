// @ts-check
import { icons as riCollection } from '@iconify-json/ri'

/**
 * Liste de nom d’icônes **sans** le préfixe de la collection Remix Icons qui sont utilisées dans l’application
 * @type {string[]}
 */
const riIconNames = [
  'arrow-right-line',
  'flag-line',
  'sun-line',
  'arrow-left-right-line',
  'arrow-left-line',
  'chat-check-line',
  'calendar-event-line',
  'flashlight-line',
  'arrow-right-down-line',
  'shopping-bag-line',
  'information-line',
  'bank-card-line',
  'edit-box-line',
  'government-line',
  'calendar-2-line',
  'money-euro-circle-line',
  'arrow-left-line',
  'mail-line',
  'question-line',
  'chat-delete-line',
  'scales-3-line',
]

/**
 * Liste de tuples [collectionDIcônes, tableauDeNomsDIcônesUtiliséesDansLApplication]
 * @type {[import('@iconify/vue').IconifyJSON, string[]][]}
 */
export const collectionsToFilter = [
  [riCollection, riIconNames],
]
