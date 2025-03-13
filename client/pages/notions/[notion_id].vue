<script lang="ts" setup>
definePageMeta({
  layout: 'default',
  validate: getContentRouteValidator('notion_id'),
  middleware: [
    'load-notion'
  ]
})

const route = useRoute()
const nuxtApp = useNuxtApp()
const notionId = route.params.notion_id
const notion = nuxtApp.payload.data[`notion-${notionId}`]
const notionTitle = notion?.titre || notionId

const { setBreadcrumbs } = useBreadcrumbStore()
setBreadcrumbs([
  { text: 'Accueil', to: '/' },
  { text: 'Aides', to: '/aides' },
  { text: notionTitle, to: `/notions/${notionId}` }
])

useSeoMeta({
  title: `Informations sur la notion "${notionTitle}" | Aides simplifiées`,
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
            {{ notionTitle }}
          </h1>
        </header>
        <ContentRenderer :value="notion" />
      </article>
    </SectionContainer>
  </BrandBackgroundContainer>
</template>

<style scoped lang="scss"></style>
