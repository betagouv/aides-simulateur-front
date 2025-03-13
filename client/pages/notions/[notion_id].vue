<script lang="ts" setup>
definePageMeta({
  layout: 'default',
  validate: getContentRouteValidator('notion_id')
})

const route = useRoute()
const notionId = route.params.notion_id

const { data: notion } = useAsyncData(`notion-${notionId}`, () => {
  return queryCollection('notions')
    .where('stem', '=', `notions/${notionId}`)
    .first()
})

const { setBreadcrumbs } = useBreadcrumbStore()
watchEffect(() => {
  if (notion.value) {
    setBreadcrumbs([
      { text: 'Accueil', to: '/' },
      { text: 'Aides', to: '/aides' },
      { text: notion.value.titre, to: `/notions/${notionId}` }
    ])
  }
})

useSeoMeta({
  title: `Informations sur la notion ${notion.value?.titre || notionId} | Aides simplifiées`,
  description: `${notion.value?.description.slice(0, 155)}...`
})
</script>

<template>
  <BrandBackgroundContainer>
    <BreadcrumbSectionContainer />
    <SectionContainer
      v-if="notion"
      type="page-header"
    >
      <article>
        <header class="fr-mb-4w">
          <h1>
            {{ notion?.titre }}
          </h1>
        </header>
        <ContentRenderer :value="notion" />
      </article>
    </SectionContainer>
  </BrandBackgroundContainer>
</template>

<style scoped lang="scss">
</style>
