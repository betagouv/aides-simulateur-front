<script lang="ts" setup>
defineProps<{
  id: string
  title: string
  pictogram: string
}>()
</script>

<template>
  <SectionContainer
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
          {{ title }}
        </h1>
      </div>
    </div>
  </SectionContainer>
</template>

<style scoped lang="scss">
.simulation-title-container {
  display: flex;
  align-items: center;
}
</style>
