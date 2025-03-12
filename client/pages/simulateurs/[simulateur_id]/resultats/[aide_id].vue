<script lang="ts" setup>
definePageMeta({
  layout: 'user-simulation',
  middleware: 'check-iframe-layout',
  validate: getContentRouteValidator(['aide_id', 'simulateur_id'])
})

const route = useRoute()

const simulateurId = route.params.simulateur_id as string
const { data: simulateur } = useAsyncData(`simulateur-${simulateurId}`, () => {
  return queryCollection('simulateurs')
    .where('stem', '=', `simulateurs/${simulateurId}`)
    .first()
})
const aideId = route.params.aide_id
const { data: aide } = useAsyncData(`aide-${aideId}`, () => {
  return queryCollection('aides')
    .where('stem', '=', `aides/${aideId}`)
    .first()
})

const { setBreadcrumbs } = useBreadcrumbStore()
watchEffect(() => {
  if (simulateur.value && aide.value) {
    setBreadcrumbs([
      { text: 'Accueil', to: '/' },
      { text: 'Simulateurs', to: '/simulateurs' },
      { text: simulateur.value.titre, to: `/simulateurs/${simulateurId}` },
      { text: 'Résultats', to: `/simulateurs/${simulateurId}/resultats` },
      { text: aide.value.titre, to: `/simulateurs/${simulateurId}/resultats/${aideId}` }
    ])
  }
})
</script>

<template>
  <div v-if="simulateur && aide">
    <h1>
      {{ aide?.titre }}
    </h1>
    <DsfrLink
      icon-before
      label="Revenir à mes résultats"
      :to="`/simulateurs/${simulateurId}/resultats`"
      :icon="{ name: 'ri:arrow-left-line', ssr: true }"
    />
    <p>
      {{ aide?.description }}
    </p>
  </div>
</template>
