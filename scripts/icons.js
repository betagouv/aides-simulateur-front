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
  'chat-check-line',
  'calendar-event-line',
  'flashlight-line',
  'arrow-right-down-line',
  'shopping-bag-line',
  'bank-card-line',
  'external-link-line',
]

/**
 * Liste de tuples [collectionDIcônes, tableauDeNomsDIcônesUtiliséesDansLApplication]
 * @type {[import('@iconify/vue').IconifyJSON, string[]][]}
 */
export const collectionsToFilter = [
  [riCollection, riIconNames],
]
