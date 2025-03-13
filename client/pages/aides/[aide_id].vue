<script lang="ts" setup>
definePageMeta({
  layout: 'default',
  validate: getContentRouteValidator('aide_id'),
  middleware: [
    'load-aide'
  ],
})

const route = useRoute()
const nuxtApp = useNuxtApp()
const aideId = route.params.aide_id
const aide = nuxtApp.payload.data[`aide-${aideId}`]
const aideTitle = aide?.titre || aideId

const { setBreadcrumbs } = useBreadcrumbStore()
setBreadcrumbs([
  { text: 'Accueil', to: '/' },
  { text: 'Aides', to: '/aides' },
  { text: aideTitle, to: `/aides/${aideId}` }
])

useSeoMeta({
  title: `Aide "${aideTitle}" | Aides simplifiées`,
  description: `${aide.value?.resume}`
})
</script>

<template>
  <BrandBackgroundContainer>
    <BreadcrumbSectionContainer />
    <SectionContainer
      v-if="aide"
      type="page-header"
    >
      <article>
        <header class="fr-mb-4w">
          <h1>
            {{ aideTitle }}
          </h1>
        </header>
        <ContentRenderer :value="aide" />
      </article>
    </SectionContainer>
  </BrandBackgroundContainer>
</template>

<style scoped lang="scss">
</style>
