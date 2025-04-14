/**
 * Composable for tracking user interactions with Matomo
 */
export function useMatomo () {
  /**
   * Track an event in Matomo
   */
  function trackEvent (category: string, action: string, name?: string, value?: number) {
    if (typeof window === 'undefined' || !(window as any)._paq) {
      return
    }

    (window as any)._paq.push(['trackEvent', category, action, name, value ?? 1])
  }

  /**
   * Get Matomo category string based on current page context
   */
  function getMatomoCategory (baseId: string): string {
    let source = 'website'

    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href)
      // Check if in iframe
      const isIframe = url.searchParams.get('iframe') === 'true'

      // Get source from URL if in iframe
      if (isIframe) {
        const utmSource = url.searchParams.get('utm_source')
        if (utmSource) {
          source = utmSource.replace('iframe@', '')
        }
      }
    }

    return `[${baseId}][${source}]Survey`
  }

  /**
   * Track an answer to a survey question
   */
  function trackSurveyAnswer (simulateurId: string, questionId: string, questionTitle: string) {
    const category = getMatomoCategory(simulateurId)
    const name = `[${simulateurId}][${category.split(']')[1].slice(1)}]${questionId}:${questionTitle}`
    trackEvent(category, 'Answer', name)
  }

  /**
   * Track the start of a survey
   */
  function trackSurveyStart (simulateurId: string) {
    const category = getMatomoCategory(simulateurId)
    const name = `[${simulateurId}]${category.split(']')[1].slice(1)}`
    trackEvent(category, 'Start', name)
  }

  /**
   * Track the submission of a survey
   */
  function trackSurveySubmit (simulateurId: string) {
    const category = getMatomoCategory(simulateurId)
    const name = `[${simulateurId}]${category.split(']')[1].slice(1)}`
    trackEvent(category, 'Submit', name)
  }

  return {
    trackEvent,
    getMatomoCategory,
    trackSurveyAnswer,
    trackSurveyStart,
    trackSurveySubmit
  }
}
