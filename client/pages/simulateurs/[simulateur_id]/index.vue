<script lang="ts" setup>
import { autocompleteFunctions } from '@/utils/autocompleteFunctions'

definePageMeta({
  layout: 'default',
  middleware: 'check-iframe-layout',
  validate ({ params }) {
    /** @todo find a better way to validate simulateur_id */
    const simulateurs = [
      'demenagement-logement',
    ]
    return simulateurs.includes(params.simulateur_id)
  }
})

const route = useRoute()
const simulateurId = route.params.simulateur_id as string

const { data: simulateur } = useAsyncData(`simulateur-${simulateurId}`, () => {
  return queryCollection('simulateurs')
    .where('stem', '=', `simulateurs/${simulateurId}`)
    .first()
}, {
  transform: (data) => {
    return {
      id: data.id,
      title: data.titre,
      pictogram: data.pictogramme
    }
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

const crumbs = computed(() => {
  if (!simulateur.value) {
    return []
  }
  return [
    { text: 'Accueil', to: '/' },
    { text: 'Simulateurs', to: '/simulateurs' },
    { text: simulateur.value.title, to: `/simulateurs/${simulateurId}` }
  ]
})
</script>

<template>
  <template v-if="simulateur">
    <div
      v-if="isIframe"
    >
      <Survey
        :simulateur-id="simulateurId"
        :autocomplete-functions="autocompleteFunctions"
      />
    </div>
    <div v-else>
      <BrandBackgroundContainer>
        <BreadcrumbSectionContainer :crumbs="crumbs" />
        <SimulationHeaderSection v-bind="simulateur" />
        <UserActionSectionRow>
          <Survey
            :simulateur-id="simulateurId"
            :autocomplete-functions="autocompleteFunctions"
          />
        </UserActionSectionRow>
      </BrandBackgroundContainer>
    </div>
  </template>
</template>
