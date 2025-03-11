<script lang="ts" setup>
definePageMeta({
  layout: 'default',
  middleware: 'check-iframe-layout',
  validate: getContentRouteValidator(['notion_id', 'simulateur_id'])
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

const notionId = route.params.notion_id
const { data: notion } = useAsyncData(`notion-${notionId}`, () => {
  return queryCollection('notions')
    .where('stem', '=', `notions/${notionId}`)
    .first()
})

const crumbs = computed(() => {
  if (!notion.value) {
    return []
  }
  if (!simulateur.value) {
    return []
  }
  return [
    { text: 'Accueil', to: '/' },
    { text: 'Simulateurs', to: '/simulateurs' },
    { text: simulateur.value.title, to: `/simulateurs/${simulateurId}` },
    { text: notion.value.title, to: `/simulateurs/${simulateurId}/${notionId}` }
  ]
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
          {{ notion?.title }}
        </h1>
        <DsfrLink
          icon-before
          label="Revenir à ma simulation"
          :link="{
            to: `/simulateurs/${simulateurId}`,
            query: route.query,
          }"
          :icon="{ name: 'ri:arrow-left-line', ssr: true }"
        />
        <p class="fr-text--lg">
          {{ notion?.description }}
        </p>
      </div>
    </template>
    <template v-else>
      <BrandBackgroundContainer>
        <BreadcrumbSectionContainer :crumbs="crumbs" />
        <SimulationHeaderSection v-bind="simulateur" />
        <UserActionSectionRow>
          <div>
            <h1>
              {{ notion?.title }}
            </h1>
            <DsfrLink
              icon-before
              label="Revenir à ma simulation"
              :link="{
                to: `/simulateurs/${simulateurId}`,
                query: route.query,
              }"
              :icon="{ name: 'ri:arrow-left-line', ssr: true }"
            />
            <p class="fr-text--lg">
              {{ notion?.description }}
            </p>
          </div>
        </UserActionSectionRow>
      </BrandBackgroundContainer>
    </template>
  </template>
</template>

<style scoped lang="scss">
</style>
