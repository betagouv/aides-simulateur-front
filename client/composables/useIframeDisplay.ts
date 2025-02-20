// client/composables/useIframeDisplay.ts
import { computed } from 'vue'

export function useIframeDisplay () {
  const route = useRoute()

  const isIframe = computed(() => {
    return route.query.iframe === 'true'
  })

  const displayOption = computed(() => {
    return route.query['data-display-option'] || ''
  })

  const showHeader = computed(() => {
    // Si ce n'est pas un iframe, on affiche le header
    if (!isIframe.value) { return true }

    // Désactiver le header si l'option du iframe est 'no-header'
    if (displayOption.value === 'no-header') { return false }

    // Afficher le header si c'est explicitement demandé ou par défaut
    return true
  })

  const showFooter = computed(() => {
    // Si ce n'est pas un iframe, on affiche le footer
    if (!isIframe.value) { return true }

    // Désactiver le footer si l'option du iframe est 'header-only'
    if (displayOption.value === 'header-only') { return false }

    return true
  })

  return {
    isIframe,
    displayOption,
    showHeader,
    showFooter,
  }
}
