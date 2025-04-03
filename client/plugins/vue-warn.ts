export default defineNuxtPlugin(() => {
  const vueApp = useNuxtApp().vueApp
  vueApp.config.warnHandler = (msg, vm, trace) => {
    if (import.meta.env.MODE === 'development' && msg.match('Hydration')) {
      console.warn(`Intercepted Vue hydration mismatch warning`)
      return
    }
    console.warn(`[Vue warn]: ${msg}${trace}`)
  }
})
