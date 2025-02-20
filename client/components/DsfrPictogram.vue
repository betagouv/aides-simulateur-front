<script lang="ts" setup>
withDefaults(defineProps<{
  svgPath: string
  svgAttrs?: () => Record<string, string>
}>(), {
  svgPath: undefined,
  svgAttrs: () => ({ viewBox: '0 0 80 80', width: '80px', height: '80px' }),
})
const defaultSvgAttrs = { viewBox: '0 0 80 80', width: '80px', height: '80px' }
</script>

<template>
  <svg
    aria-hidden="true"
    class="fr-artwork"
    v-bind="{ ...defaultSvgAttrs, ...svgAttrs }"
  >
    <use
      class="fr-artwork-decorative"
      :href="`${svgPath}#artwork-decorative`"
    />
    <use
      class="fr-artwork-minor"
      :href="`${svgPath}#artwork-minor`"
    />
    <use
      class="fr-artwork-major"
      :href="`${svgPath}#artwork-major`"
    />
  </svg>
</template>
