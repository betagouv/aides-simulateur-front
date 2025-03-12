<script setup lang="ts">
const props = withDefaults(defineProps<{
  contrast?: boolean
}>(), {
  contrast: false
})

const { breadcrumbs } = storeToRefs(useBreadcrumbStore())

const styles = computed(() => {
  if (!props.contrast) {
    return {}
  }
  return {
    '--text-default-grey': 'var(--brand-contrast-text--disabled)',
    '--text-mention-grey': 'var(--brand-contrast-text)',
  }
})
</script>

<template>
  <SectionContainer type="page-breadcrumb">
    <div class="fr-grid-row fr-grid-row--gutters">
      <div class="fr-col-12">
        <DsfrBreadcrumb
          v-if="breadcrumbs.length"
          class="fr-m-0"
          :style="styles"
          breadcrumb-id="fil-ariane"
          :links="breadcrumbs"
        />
      </div>
    </div>
  </SectionContainer>
</template>
