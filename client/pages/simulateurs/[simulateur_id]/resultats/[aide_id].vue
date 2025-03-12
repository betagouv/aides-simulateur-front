<script lang="ts" setup>
definePageMeta({
  layout: 'default',
  middleware: 'check-iframe-layout',
  validate: getContentRouteValidator(['aide_id', 'simulateur_id'])
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
      { text: simulateur.value.title, to: `/simulateurs/${simulateurId}` },
      { text: 'Résultats', to: `/simulateurs/${simulateurId}/resultats` },
      { text: aide.value.title, to: `/simulateurs/${simulateurId}/resultats/${aideId}` }
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
        <h1>
          {{ aide?.title }}
        </h1>
        <DsfrLink
          icon-before
          label="Revenir à mes résultats"
          :link="{
            to: `/simulateurs/${simulateurId}/resultats`,
            query: route.query,
          }"
          :icon="{ name: 'ri:arrow-left-line', ssr: true }"
        />
        <p>
          {{ aide?.description }}
        </p>
      </div>
    </template>
    <template v-else>
      <BrandBackgroundContainer>
        <BreadcrumbSectionContainer />
        <SimulationHeaderSection v-bind="simulateur" />
        <UserActionSectionRow>
          <div>
            <h1>
              {{ aide.title }}
            </h1>
            <DsfrLink
              icon-before
              label="Revenir à mes résultats"
              :to="`/simulateurs/${simulateurId}/resultats`"
              :icon="{ name: 'ri:arrow-left-line', ssr: true }"
            />
            <p class="fr-text--lg">
              {{ aide.description }}
            </p>
          </div>
        </UserActionSectionRow>
      </BrandBackgroundContainer>
    </template>
  </template>
</template>

<style scoped lang="scss">
</style>
