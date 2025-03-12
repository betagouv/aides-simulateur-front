<script setup lang="ts">
import type { VIconProps } from '@gouvminint/vue-dsfr'
import type { RouteLocationRaw } from 'vue-router'

withDefaults(defineProps<{
  label: string
  iconBefore?: boolean
  to: RouteLocationRaw
  icon: VIconProps
}>(), {
  iconBefore: false
})
</script>

<template>
  <NuxtLink
    class="fr-link"
    :to="to"
  >
    <VIcon
      v-if="icon && iconBefore"
      v-bind="icon"
      aria-hidden="true"
    />
    {{ label }}
    <VIcon
      v-if="icon && !iconBefore"
      v-bind="icon"
      aria-hidden="true"
    />
  </NuxtLink>
</template>
