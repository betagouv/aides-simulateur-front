<script lang="ts" setup>
definePageMeta({
  layout: 'default',
  middleware: 'check-iframe-layout',
  validate ({ params }) {
    /** @todo find a better way to validate simulateur_id */
    const simulateurs = [
      'demenagement-logement',
    ]
    return simulateurs.includes(params.simulateur_id)
  }
})

const route = useRoute()
const simulateurId = route.params.simulateur_id as string

const { data: simulateur } = useAsyncData(`simulateur-${simulateurId}`, () => {
  return queryCollection('simulateurs')
    .where('stem', '=', `simulateurs/${simulateurId}`)
    .first()
}, {
  transform: (data) => {
    return {
      id: data.id,
      title: data.titre,
      pictogram: data.pictogramme
    }
  }
})

const crumbs = computed(() => {
  if (!simulateur.value) {
    return []
  }
  return [
    { text: 'Accueil', to: '/' },
    { text: 'Simulateurs', to: '/simulateurs' },
    { text: simulateur.value.title, to: `/simulateurs/${simulateurId}` },
    { text: 'Résultats', to: `/simulateurs/${simulateurId}/resultats` }
  ]
})
</script>

<template>
  <template v-if="simulateur">
    <BrandBackgroundContainer>
      <BreadcrumbSectionContainer :crumbs="crumbs" />
      <SimulationHeaderSection v-bind="simulateur" />
      <UserActionSectionRow>
        <div>
          <h2>Les résultats de votre simulation</h2>
          <DsfrLink
            icon-before
            label="Revenir à ma simulation"
            :link="{
              to: `/simulateurs/${simulateurId}`,
            }"
            :icon="{ name: 'ri:arrow-left-line', ssr: true }"
          />
          <p>Voici les résultats de votre simulation</p>
        </div>
      </UserActionSectionRow>
    </BrandBackgroundContainer>
  </template>
</template>
