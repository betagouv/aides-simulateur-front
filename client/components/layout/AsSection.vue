<script lang="ts" setup>
const props = withDefaults(defineProps<{
  type?: 'default' | 'grouped-first' | 'grouped' | 'grouped-last' | 'user-action' | 'simulation-header' | 'page-header' | 'breadcrumb'
  backgroundColor?: 'default--grey' | 'alt--blue-france' | 'action-high--blue-france'
}>(), {
  type: 'default',
})

const paddingsClassesVariants = {
  'default': 'fr-py-6w fr-py-sm-8w fr-py-md-12w',
  'grouped-first': 'fr-pt-6w fr-pt-sm-8w fr-pt-md-12w fr-pb-4w fr-pb-sm-6w fr-pb-md-8w',
  'grouped': 'fr-py-4w fr-py-sm-6w fr-py-md-8w',
  'grouped-last': 'fr-pt-4w fr-pt-sm-6w fr-pt-md-8w fr-pb-6w fr-pb-sm-8w fr-pb-md-12w',
  'user-action': 'fr-pt-6w fr-pt-md-8w fr-pb-9w fr-pb-md-12w',
  'breadcrumb': 'fr-pt-3w fr-pt-md-4w fr-pb-1w fr-pb-md-3v',
  'simulation-header': 'fr-pt-1w fr-pt-md-3v fr-pb-3w fr-pb-md-4w',
  'page-header': 'fr-pt-1w fr-pt-md-3v fr-pb-3w fr-pb-md-4w',
  'page-full': 'fr-pt-1w fr-pt-md-3v fr-pb-9W fr-pb-md-12w',
}
const paddingsClasses = paddingsClassesVariants[props.type]
</script>

<template>
  <section
    class="as-section"
    :class="[{
      [ `fr-background-${backgroundColor}`]: Boolean(backgroundColor),
      [paddingsClasses]: Boolean(paddingsClasses),
    }]"
  >
    <div class="fr-container">
      <slot />
    </div>
  </section>
</template>

<style lang="scss">
</style>
