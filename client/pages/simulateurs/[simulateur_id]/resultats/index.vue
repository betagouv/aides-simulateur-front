<script lang="ts" setup>
definePageMeta({
  layout: 'default',
  middleware: 'check-iframe-layout',
  validate: getContentRouteValidator('simulateur_id')
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

const { setBreadcrumbs } = useBreadcrumbStore()
watchEffect(() => {
  if (simulateur.value) {
    setBreadcrumbs([
      { text: 'Accueil', to: '/' },
      { text: 'Simulateurs', to: '/simulateurs' },
      { text: simulateur.value.title, to: `/simulateurs/${simulateurId}` },
      { text: 'Résultats', to: `/simulateurs/${simulateurId}/resultats` }
    ])
  }
})

const { isIframe } = useIframeDisplay()
</script>

<template>
  <template v-if="simulateur">
    <template
      v-if="isIframe"
    >
      <div>
        <h2>Les résultats de votre simulation</h2>
        <DsfrLink
          icon-before
          label="Revenir à ma simulation"
          :link="{
            to: `/simulateurs/${simulateurId}`,
            query: route.query,
          }"
          :icon="{ name: 'ri:arrow-left-line', ssr: true }"
        />
        <p>Voici les résultats de votre simulation</p>
      </div>
    </template>
    <template v-else>
      <BrandBackgroundContainer>
        <BreadcrumbSectionContainer />
        <SimulationHeaderSection v-bind="simulateur" />
        <UserActionSectionRow>
          <div>
            <h2>Les résultats de votre simulation</h2>
            <DsfrLink
              icon-before
              label="Revenir à ma simulation"
              :link="{
                to: `/simulateurs/${simulateurId}`,
                query: route.query,
              }"
              :icon="{ name: 'ri:arrow-left-line', ssr: true }"
            />
            <p>Voici les résultats de votre simulation</p>
          </div>
        </UserActionSectionRow>
      </BrandBackgroundContainer>
    </template>
  </template>
</template>
