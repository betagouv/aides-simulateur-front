<script lang="ts" setup>
definePageMeta({
  layout: 'user-simulation',
  middleware: 'check-iframe-layout',
  validate: getContentRouteValidator(['notion_id', 'simulateur_id'])
})

const route = useRoute()

const simulateurId = route.params.simulateur_id as string
const { data: simulateur } = useAsyncData(`simulateur-${simulateurId}`, () => {
  return queryCollection('simulateurs')
    .where('stem', '=', `simulateurs/${simulateurId}`)
    .first()
})

const notionId = route.params.notion_id
const { data: notion } = useAsyncData(`notion-${notionId}`, () => {
  return queryCollection('notions')
    .where('stem', '=', `notions/${notionId}`)
    .first()
})

const { setBreadcrumbs } = useBreadcrumbStore()
watchEffect(() => {
  if (simulateur.value && notion.value) {
    setBreadcrumbs([
      { text: 'Accueil', to: '/' },
      { text: 'Simulateurs', to: '/simulateurs' },
      { text: simulateur.value.titre, to: `/simulateurs/${simulateurId}#simulateur-title` },
      { text: notion.value.titre, to: `/simulateurs/${simulateurId}/${notionId}#simulateur-title` }
    ])
  }
})

useSeoMeta({
  title: `Informations sur la notion ${notion.value?.titre || notionId} | Aides simplifiées`,
  description: `${notion.value?.description.slice(0, 155)}...`
})
</script>

<template>
  <article v-if="simulateur && notion">
    <header class="fr-mb-6w">
      <h1>
        {{ notion?.titre }}
      </h1>
      <DsfrLink
        icon-before
        label="Revenir à ma simulation"
        :to="`/simulateurs/${simulateurId}#simulateur-title`"
        :icon="{ name: 'ri:arrow-left-line', ssr: true }"
      />
    </header>
    <div class="fr-card fr-p-3w">
      <ContentRenderer :value="notion" />
    </div>
  </article>
</template>

<style scoped lang="scss">
</style>
