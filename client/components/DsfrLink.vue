<script setup lang="ts">
withDefaults(defineProps<{
  label: string
  iconBefore?: boolean
  link: PropType<NuxtLink>
  icon: PropType<VIcon>
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
