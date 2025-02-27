export default defineNuxtRouteMiddleware((to) => {
  if (isIframeRoute(to)) {
    return setPageLayout('iframe')
  }
})
