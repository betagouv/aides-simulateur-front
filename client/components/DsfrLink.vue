<script setup lang="ts">
import type { VIconProps } from '@gouvminint/vue-dsfr'
import type { RouterLink } from 'vue-router'

withDefaults(defineProps<{
  label: string
  iconBefore?: boolean
  link: PropType<typeof RouterLink>
  icon: VIconProps
}>(), {
  iconBefore: false
})
</script>

<template>
  <NuxtLink
    class="fr-link"
    v-bind="link"
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
