<script lang="ts" setup>
withDefaults(defineProps<{
  type?: 'default' | 'user-action' | 'simulation-header' | 'breadcrumb',
  backgroundColor?: 'default--grey' | 'alt--blue-france' | 'action-high--blue-france'
}>(), {
  type: 'default',
})
</script>

<template>
  <section
    class="as-section"
    :class="[{
      'fr-pt-3w fr-pb-1w fr-pt-md-4w fr-pb-md-3v': type === 'breadcrumb',
      'fr-pt-1w fr-pb-3w fr-pt-md-3v fr-pb-md-4w': type === 'simulation-header',
      'fr-py-8w fr-py-md-12w': type === 'default',
      'fr-pt-6w fr-pt-md-8w fr-pb-9W fr-pb-md-12w': type === 'user-action',
      [ `fr-background-${backgroundColor}`]: Boolean(backgroundColor),
    }]"
  >
    <div class="fr-container">
      <slot />
    </div>
  </section>
</template>

<style lang="scss">
</style>
