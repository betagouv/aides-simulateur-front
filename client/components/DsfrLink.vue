<script setup lang="ts">
import type { VIconProps } from '@gouvminint/vue-dsfr'
import type { RouteLocationRaw } from 'vue-router'

const props = withDefaults(defineProps<{
  label: string
  iconBefore?: boolean
  to: RouteLocationRaw
  target?: '_blank' | '_self' | '_parent' | '_top'
  icon: VIconProps
}>(), {
  target: '_self',
  iconBefore: false
})

const hasIcon = (props.icon && props.target !== '_blank')
</script>

<template>
  <NuxtLink
    class="fr-link"
    :to="to"
    :target="target"
  >
    <VIcon
      v-if="hasIcon && iconBefore"
      v-bind="icon"
      aria-hidden="true"
    />
    {{ label }}
    <VIcon
      v-if="hasIcon && !iconBefore"
      v-bind="icon"
      aria-hidden="true"
    />
  </NuxtLink>
</template>

<style scoped lang="scss">
.fr-link[target="_blank"]::after {
  margin-left: 0 !important;
}
</style>
