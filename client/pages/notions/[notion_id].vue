<script lang="ts" setup>
definePageMeta({
  layout: 'default',
  validate ({ params }) {
    /** @todo find a better way to validate notion_id */
    const notions = [
      'revenus-apl',
    ]
    return notions.includes(params.notion_id)
  }
})

const route = useRoute()
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
  return [
    { text: 'Accueil', to: '/' },
    { text: 'Notions', to: '/notions' },
    { text: notion.value.title, to: `/notions/${notion.value.id}` }
  ]
})
</script>

<template>
  <BrandBackgroundContainer>
    <BreadcrumbSectionContainer :crumbs="crumbs" />
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
