<script lang="ts" setup>
definePageMeta({
  layout: 'user-simulation',
  middleware: 'check-iframe-layout',
  validate: getContentRouteValidator(['aide_id', 'simulateur_id'])
})

const route = useRoute()

const simulateurId = route.params.simulateur_id as string
const { data: simulateur } = await useAsyncData(`simulateur-${simulateurId}`, () => {
  return queryCollection('simulateurs')
    .where('stem', '=', `simulateurs/${simulateurId}`)
    .first()
})
const aideId = route.params.aide_id
const { data: aide } = await useAsyncData(`aide-${aideId}`, () => {
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
      { text: simulateur.value.titre, to: `/simulateurs/${simulateurId}#simulateur-title` },
      { text: 'Résultats', to: `/simulateurs/${simulateurId}/resultats#simulateur-title` },
      { text: aide.value.titre, to: `/simulateurs/${simulateurId}/resultats/${aideId}#simulateur-title` }
    ])
  }
})

useSeoMeta({
  title: `Aide ${aide.value?.titre || aideId} | Aides simplifiées`,
  description: `${aide.value?.resume}`
})
</script>

<template>
  <article v-if="simulateur && aide">
    <header class="fr-mb-6w">
      <h1>
        {{ aide?.titre }}
      </h1>
      <DsfrLink
        icon-before
        label="Revenir à ma simulation"
        :to="`/simulateurs/${simulateurId}#simulateur-title`"
        :icon="{ name: 'ri:arrow-left-line', ssr: true }"
      />
    </header>
    <div class="fr-card fr-p-3w">
      <ContentRenderer :value="aide" />
    </div>
  </article>
</template>
