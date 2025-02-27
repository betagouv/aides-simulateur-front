<script lang="ts" setup>
import { type Aide, aides } from '@/data/aides'

definePageMeta({
  layout: 'default',
  validate ({ params }) {
    return aides.some(a => a.id === params.aide_id)
  }
})

const route = useRoute()
const aideId = ref(route.params.simulateur_id)

const aide = computed<Aide>(() => {
  // We can safely cast here because we validated the route
  return aides.find(a => a.id === aideId.value) as Aide
})

const crumbs = computed(() => {
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
            {{ aide.title }}
          </h1>
        </div>
      </div>
    </SectionContainer>
  </BrandBackgroundContainer>
</template>

<style scoped lang="scss">
</style>
