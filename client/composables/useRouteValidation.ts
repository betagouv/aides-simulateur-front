import type { RouteLocationNormalizedGeneric } from 'vue-router'

export const VALID_ROUTES = {
  simulateur_id: ['demenagement-logement'],
  notion_id: [
    'revenus-apl',
    'handicap',
    'habiter-avec-conjoint',
    'revenus-conjoint',
    'loyer-montant-charges',
    'salaire-imposable'
  ],
  aide_id: [
    'aide-personnalisee-logement',
    'fond-solidarite-logement',
    'garantie-visale',
    'locapass',
    'mobilite-master-1',
    'mobilite-parcourssup'
  ],
}

export type RouteCategory = keyof typeof VALID_ROUTES

function validateRouteParam (category: RouteCategory, paramValue: string | string[]): boolean {
  const validValues = VALID_ROUTES[category]
  const value = Array.isArray(paramValue) ? paramValue[0] : paramValue
  return validValues.includes(value)
}

export function getContentRouteValidator (key: RouteCategory | RouteCategory[]) {
  const paramNames = Array.isArray(key) ? key : [key]
  return (route: RouteLocationNormalizedGeneric) => {
    return paramNames.every((paramName) => {
      return validateRouteParam(paramName, route.params[paramName])
    })
  }
}
