export default defineNuxtPlugin(() => {
  const vueApp = useNuxtApp().vueApp
  vueApp.config.warnHandler = (msg, vm, trace) => {
    // Temporary ignore hydration warnings in dev mode, waiting for a fix in vue-dsfr
    if (import.meta.env.NODE_ENV === 'development' && (msg.includes('Hydration attribute mismatch') || msg.includes('Hydration style mismatch'))) {
      return
    }
    console.warn(`[Vue warn]: ${msg}${trace}`)
  }
})
