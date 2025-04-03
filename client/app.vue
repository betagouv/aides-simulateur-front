<script lang="ts" setup>
const route = useRoute()
const backToTop = ref<HTMLElement | null>(null)

// Use the iframe display composable to check if we're in an iframe
const { isIframe } = useIframeDisplay()

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

// Only load Crisp when not in an iframe
useHead({
  script: !isIframe.value
    ? [
        {
          children: 'window.$crisp=[];window.CRISP_WEBSITE_ID="b50374f8-3b29-4704-8022-7640e7e73fc3";',
        },
        {
          src: 'https://client.crisp.chat/l.js',
          async: true,
        }
      ]
    : []
})
</script>

<template>
  <div ref="backToTop" />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
