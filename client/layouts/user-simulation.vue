<script lang="ts" setup>
const route = useRoute()
const simulateurId = computed(() => route.params.simulateur_id as string)
const nuxtApp = useNuxtApp()
const simulateur = computed(() => {
  return nuxtApp.payload.data[`simulateur-${simulateurId.value}`]
})
</script>

<template>
  <SharedDsfrLayout>
    <BrandBackgroundContainer>
      <BreadcrumbSectionContainer />
      <SectionContainer
        type="page-header"
      >
        <div class="fr-grid-row fr-grid-row--gutters">
          <div class="pictogram-container fr-col-3 fr-col-sm-2 fr-col-lg-1">
            <DsfrPictogram
              v-if="simulateur?.pictogramme"
              :svg-path="simulateur.pictogramme"
            />
          </div>
          <!-- <div
            id="simulateur-title"
            class="simulation-title-container fr-col-9 fr-col-sm-10 fr-col-lg-11"
          > -->
          <div
            class="simulation-title-container fr-col-9 fr-col-sm-10 fr-col-lg-11"
          >
            <h1
              v-if="simulateur?.titre"
              class="fr-h5 fr-m-0"
            >
              {{ simulateur.titre }}
            </h1>
          </div>
        </div>
      </SectionContainer>
    </BrandBackgroundContainer>
    <BrandBackgroundContainer
      textured
      blue
      subtle
    >
      <SectionContainer
        type="page-footer"
        class="simulateur-container"
      >
        <div class="fr-grid-row fr-grid-row--gutters">
          <div class="fr-col-12 fr-col-offset-md-1 fr-col-md-10 fr-col-offset-lg-2 fr-col-lg-8">
            <slot />
          </div>
        </div>
      </SectionContainer>
    </BrandBackgroundContainer>
  </SharedDsfrLayout>
</template>

<style scoped lang="scss">
.simulation-title-container {
  display: flex;
  align-items: center;
  min-height: 6rem;
}

.simulateur-container {
  min-height: 80vh;
}

.pictogram-container:deep(svg) {
  width: 100%;
}
</style>
