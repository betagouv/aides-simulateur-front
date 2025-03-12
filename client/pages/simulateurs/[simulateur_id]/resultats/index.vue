<script lang="ts" setup>
definePageMeta({
  layout: 'user-simulation',
  middleware: 'check-iframe-layout',
  validate: getContentRouteValidator('simulateur_id')
})

const route = useRoute()
const simulateurId = route.params.simulateur_id as string

const { data: simulateur } = useAsyncData(`simulateur-${simulateurId}`, () => {
  return queryCollection('simulateurs')
    .where('stem', '=', `simulateurs/${simulateurId}`)
    .first()
})

const { setBreadcrumbs } = useBreadcrumbStore()
watchEffect(() => {
  if (simulateur.value) {
    setBreadcrumbs([
      { text: 'Accueil', to: '/' },
      { text: 'Simulateurs', to: '/simulateurs' },
      { text: simulateur.value.titre, to: `/simulateurs/${simulateurId}` },
      { text: 'Résultats', to: `/simulateurs/${simulateurId}/resultats` }
    ])
  }
})

const resultsStore = useResultsStore()
const results = resultsStore.getResults(simulateurId)

if (!results) {
  navigateTo(`/simulateurs/${simulateurId}`)
}
</script>

<template>
  <SimulationResults
    v-if="simulateur && results"
    :results="results"
    :simulateur-id="simulateurId"
    :simulateur-title="simulateur.titre"
  />
</template>
