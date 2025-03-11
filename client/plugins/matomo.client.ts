import { defineNuxtPlugin } from '#app'
import VueMatomo from 'vue-matomo'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  nuxtApp.vueApp.use(VueMatomo, {
    ...config.public.matomo,
    router: nuxtApp.$router, // Enables automatically registering pageviews on the router
    enableLinkTracking: true,
    requireConsent: false,
    trackInitialView: true,
    disableCookies: true,
    requireCookieConsent: false,
  })
})
