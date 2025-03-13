<script lang="ts" setup>
definePageMeta({
  layout: 'default',
  validate: getContentRouteValidator('aide_id')

})

const route = useRoute()

const aideId = route.params.aide_id
const { data: aide } = useAsyncData(`aide-${aideId}`, () => {
  return queryCollection('aides')
    .where('stem', '=', `aides/${aideId}`)
    .first()
})

const { setBreadcrumbs } = useBreadcrumbStore()
watchEffect(() => {
  if (aide.value) {
    setBreadcrumbs([
      { text: 'Accueil', to: '/' },
      { text: 'Aides', to: '/aides' },
      { text: aide.value.titre, to: `/aides/${aideId}` }
    ])
  }
})

useSeoMeta({
  title: `Aide ${aide.value?.titre || aideId} | Aides simplifiées`,
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
            {{ aide?.titre }}
          </h1>
        </header>
        <ContentRenderer :value="aide" />
      </article>
    </SectionContainer>
  </BrandBackgroundContainer>
</template>

<style scoped lang="scss">
</style>
