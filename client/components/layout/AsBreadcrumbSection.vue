<script setup lang="ts">
const props = withDefaults(defineProps<{
  crumbs: { text: string, to: string }[]
  contrast?: boolean
}>(), {
  contrast: false
})

const styles = computed(() => {
  if (!props.contrast) { return {} }
  return {
    '--text-default-grey': 'var(--as-contrast-text--disabled)',
    '--text-mention-grey': 'var(--as-contrast-text)',
  }
})
</script>

<template>
  <AsSection
    type="breadcrumb"
  >
    <div class="fr-grid-row fr-grid-row--gutters">
      <div class="fr-col-12">
        <DsfrBreadcrumb
          class="fr-m-0"
          :style="styles"
          breadcrumb-id="fil-ariane"
          :links="crumbs"
        />
      </div>
    </div>
  </AsSection>
</template>
