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
      { text: notion.value.title, to: `/notions/${notionId}` }
    ])
  }
})

useSeoMeta({
  title: `Informations sur la notion ${notion.value?.title || notionId} | Aides simplifiées`,
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
      <div class="fr-grid-row fr-grid-row--gutters">
        <div class="fr-col-9 fr-col-sm-10 fr-col-md-11">
          <h1>
            {{ notion?.title }}
          </h1>
          <p class="fr-text--lg">
            {{ notion?.description }}
          </p>
        </div>
      </div>
    </SectionContainer>
  </BrandBackgroundContainer>
</template>

<style scoped lang="scss">
</style>
