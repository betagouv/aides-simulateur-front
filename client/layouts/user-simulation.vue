<script lang="ts" setup>
const route = useRoute()
const simulateurId = computed(() => route.params.simulateur_id as string)

const { data: simulateur } = useAsyncData(`simulateur-${simulateurId.value}`, () => {
  return queryCollection('simulateurs')
    .where('stem', '=', `simulateurs/${simulateurId.value}`)
    .first()
}, {
  watch: [route]
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
          <div class="fr-col-3 fr-col-sm-2 fr-col-md-1">
            <DsfrPictogram
              v-if="simulateur?.pictogramme"
              :svg-path="simulateur.pictogramme"
            />
          </div>
          <div
            id="simulateur-title"
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
      <SectionContainer type="page-footer">
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
}
</style>
