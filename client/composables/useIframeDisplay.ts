export function useIframeDisplay () {
  const route = useRoute()

  const isIframe = computed(() => {
    return isIframeRoute(route)
  })

  const displayOption = computed(() => {
    return route.query['data-display-option'] || ''
  })

  // Get the source domain of the iframe from UTM parameters
  function getIframeSource (): string {
    // Extract source from UTM parameters if available
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      const utmSource = urlParams.get('utm_source')
      if (utmSource) {
        return utmSource.replace('iframe@', '')
      }
    }
    return 'unknown'
  }

  return {
    isIframe,
    displayOption,
    getIframeSource,
  }
}
