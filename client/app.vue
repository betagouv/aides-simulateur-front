<script lang="ts" setup>
const route = useRoute()
const backToTop = ref<HTMLElement | null>(null)

/**
 * On route change, focus the back to top template ref.
 * @see https://vuejs.org/guide/best-practices/accessibility
 */
watch(route, () => {
  backToTop.value?.focus()
})

onMounted(() => {
  backToTop.value?.focus()
})
</script>

<template>
  <div ref="backToTop" />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
