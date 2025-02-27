<script lang="ts" setup>
import { type Simulateur, simulateurs } from '@/data/simulateurs'

definePageMeta({
  layout: 'default',
  middleware: 'check-iframe-layout',
  validate ({ params }) {
    return simulateurs.some(s => s.id === params.simulateur_id)
  }
})

const route = useRoute()
const simulateurId = ref(route.params.simulateur_id)

const simulateur = computed<Simulateur>(() => {
  // We can safely cast here because we validated the route
  return simulateurs.find(s => s.id === simulateurId.value) as Simulateur
})

const crumbs = computed(() => {
  return [
    { text: 'Accueil', to: '/' },
    { text: 'Simulateurs', to: '/simulateurs' },
    { text: simulateur.value.title, to: `/simulateurs/${simulateur.value.id}` }
  ]
})

// Load pictogram dynamically
const pictogram = ref<string | undefined>()
simulateur.value.pictogram()
  .then((svg) => {
    pictogram.value = svg.default
  })
</script>

<template>
  <BrandBackgroundContainer>
    <BreadcrumbSectionContainer :crumbs="crumbs" />
    <SectionContainer
      v-if="simulateur"
      type="simulation-header"
    >
      <div class="fr-grid-row fr-grid-row--gutters">
        <div class="fr-col-3 fr-col-sm-2 fr-col-md-1">
          <DsfrPictogram
            v-if="pictogram"
            :svg-path="pictogram"
          />
        </div>
        <div class="title-container fr-col-9 fr-col-sm-10 fr-col-md-11">
          <h1 class="fr-h5 fr-m-0">
            {{ simulateur.title }}
          </h1>
        </div>
      </div>
    </SectionContainer>
  </BrandBackgroundContainer>
  <BrandBackgroundContainer
    textured
    blue
  >
    <SectionContainer type="user-action">
      <div class="fr-grid-row fr-grid-row--gutters">
        <div class="fr-col-12 fr-col-offset-md-1 fr-col-md-10 fr-col-offset-lg-2 fr-col-lg-8">
          Simulation form for "{{ simulateur.title }}"
        </div>
      </div>
    </SectionContainer>
  </BrandBackgroundContainer>
</template>

<style scoped lang="scss">
.title-container {
  display: flex;
  align-items: center;
}
</style>
