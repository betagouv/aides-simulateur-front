<script lang="ts" setup>
import { autocompleteFunctions } from '@/utils/autocompleteFunctions'

definePageMeta({
  layout: 'user-simulation',
  middleware: 'check-iframe-layout',
  validate: getContentRouteValidator('simulateur_id')
})

const route = useRoute()
const simulateurId = route.params.simulateur_id as string

const { data: simulateur } = useAsyncData(`simulateur-${simulateurId}`, () => {
  return queryCollection('simulateurs')
    .where('stem', '=', `simulateurs/${simulateurId}`)
    .first()
})

const { setBreadcrumbs } = useBreadcrumbStore()
watchEffect(() => {
  if (simulateur.value) {
    setBreadcrumbs([
      { text: 'Accueil', to: '/' },
      { text: 'Simulateurs', to: '/simulateurs' },
      { text: simulateur.value.titre, to: `/simulateurs/${simulateurId}` }
    ])
  }
})

// Load iframe-resizer script when in iframe mode
const { isIframe } = useIframeDisplay()
onMounted(() => {
  if (isIframe.value) {
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/iframe-resizer@4.3.2/js/iframeResizer.contentWindow.min.js'
    script.async = true
    document.head.appendChild(script)
  }
})
</script>

<template>
  <template v-if="simulateur">
    <Survey
      :simulateur-id="simulateurId"
      :autocomplete-functions="autocompleteFunctions"
    />
  </template>
</template>
