<script lang="ts" setup>
import type { Simulateur } from '@/data/simulateurs'

const props = defineProps<{
  simulateur: Simulateur
}>()
const crumbs = computed(() => {
  return [
    { text: 'Accueil', to: '/' },
    { text: 'Simulateurs', to: '/simulateurs' },
    { text: props.simulateur.title, to: `/simulateurs/${props.simulateur.id}` }
  ]
})
// Load pictogram dynamically
const pictogram = (await props.simulateur.pictogram()).default
</script>

<template>
  <BrandBackgroundContainer>
    <BreadcrumbSectionContainer :crumbs="crumbs" />
    <SectionContainer
      v-if="simulateur"
      type="page-header"
    >
      <div class="fr-grid-row fr-grid-row--gutters">
        <div class="fr-col-3 fr-col-sm-2 fr-col-md-1">
          <DsfrPictogram
            v-if="pictogram"
            :svg-path="pictogram"
          />
        </div>
        <div class="simulation-title-container fr-col-9 fr-col-sm-10 fr-col-md-11">
          <h1 class="fr-h5 fr-m-0">
            {{ simulateur.title }}
          </h1>
        </div>
      </div>
    </SectionContainer>
  </BrandBackgroundContainer>
</template>

<style scoped lang="scss">
.simulation-title-container {
  display: flex;
  align-items: center;
}
</style>
