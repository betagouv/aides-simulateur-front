<script lang="ts" setup>
definePageMeta({
  layout: 'user-simulation',
  middleware: [
    'check-iframe-layout',
    'load-simulateur'
  ],
  validate: getContentRouteValidator('simulateur_id')
})

const route = useRoute()
const nuxtApp = useNuxtApp()
const simulateurId = route.params.simulateur_id as string
const simulateur = nuxtApp.payload.data[`simulateur-${simulateurId}`]
const simulateurTitle = simulateur?.titre || simulateurId
const { setBreadcrumbs } = useBreadcrumbStore()
setBreadcrumbs([
  { text: 'Accueil', to: '/' },
  { text: 'Simulateurs', to: '/simulateurs' },
  { text: simulateurTitle, to: `/simulateurs/${simulateurId}#simulateur-title` },
  { text: 'Résultats', to: `/simulateurs/${simulateurId}/resultats#simulateur-title` }
])
useSeoMeta({
  title: `Résultats de votre simulation "${simulateurTitle}" | Aides simplifiées`,
  description: `Découvrez les aides auxquelles vous êtes eligibles avec les résultats de votre simulation "${simulateurTitle}".`
})

const resultsStore = useResultsStore()
const results = resultsStore.getResults(simulateurId)

if (!results) {
  navigateTo(`/simulateurs/${simulateurId}#simulateur-title`)
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
