<script lang="ts" setup>
definePageMeta({
  layout: 'default',
  validate ({ params }) {
    /** @todo find a better way to validate aide_id */
    const aides = [
      'fsl',
      'garantie-visale',
    ]
    return (
      aides.includes(params.aide_id)
    )
  }
})

const route = useRoute()

const aideId = route.params.aide_id
const { data: aide } = useAsyncData(`aide-${aideId}`, () => {
  return queryCollection('aides')
    .where('stem', '=', `aides/${aideId}`)
    .first()
})
const crumbs = computed(() => {
  if (!aide.value) {
    return []
  }
  return [
    { text: 'Accueil', to: '/' },
    { text: 'Aides', to: '/aides' },
    { text: aide.value.title, to: `/aides/${aide.value.id}` }
  ]
})
</script>

<template>
  <BrandBackgroundContainer>
    <BreadcrumbSectionContainer :crumbs="crumbs" />
    <SectionContainer
      v-if="aide"
      type="page-header"
    >
      <div class="fr-grid-row fr-grid-row--gutters">
        <div class="fr-col-9 fr-col-sm-10 fr-col-md-11">
          <h1>
            {{ aide.titre }}
          </h1>
        </div>
        <div class="fr-col-9 fr-col-sm-10 fr-col-md-11">
          <ContentRenderer :value="aide" />
        </div>
      </div>
    </SectionContainer>
  </BrandBackgroundContainer>
</template>

<style scoped lang="scss">
</style>
