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
]

/**
 * Liste de tuples [collectionDIcônes, tableauDeNomsDIcônesUtiliséesDansLApplication]
 * @type {[import('@iconify/vue').IconifyJSON, string[]][]}
 */
export const collectionsToFilter = [
  [riCollection, riIconNames],
]
