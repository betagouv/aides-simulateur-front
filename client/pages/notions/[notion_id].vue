<script lang="ts" setup>
import { type Notion, notions } from '@/data/notions'

definePageMeta({
  layout: 'default',
  validate ({ params }) {
    return notions.some(n => n.id === params.notion_id)
  }
})

const route = useRoute()
const notionId = ref(route.params.notion_id)

const notion = computed<Notion>(() => {
  // We can safely cast here because we validated the route
  return notions.find(n => n.id === notionId.value) as Notion
})

const crumbs = computed(() => {
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
            {{ notion.title }}
          </h1>
          <p class="fr-text--lg">
            {{ notion.description }}
          </p>
        </div>
      </div>
    </SectionContainer>
  </BrandBackgroundContainer>
</template>

<style scoped lang="scss">
</style>
