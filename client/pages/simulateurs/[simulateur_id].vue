<script lang="ts" setup>
import { useIframeDisplay } from '@/composables/useIframeDisplay'
import { type Simulateur, simulateurs } from '@/data/simulateurs'

const { isIframe } = useIframeDisplay()

definePageMeta({
  layout: 'default',
  middleware: 'check-iframe-layout',
  validate ({ params }) {
    return simulateurs.some(s => s.id === params.simulateur_id)
  }
})

const route = useRoute()

const simulateurId = ref(route.params.simulateur_id as string)

const simulateur = computed<Simulateur>(() => {
  // We can safely cast here because we validated the route
  return simulateurs.find(s => s.id === simulateurId.value) as Simulateur
})

// Load iframe-resizer script when in iframe mode
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
  <SimulationHeaderSection :simulateur="simulateur" />
  <BrandBackgroundContainer
    textured
    blue
    subtle
  >
    <SectionContainer type="page-footer">
      <div class="fr-grid-row fr-grid-row--gutters">
        <Survey :simulateur-id="simulateurId" />
      </div>
    </SectionContainer>
  </BrandBackgroundContainer>
</template>

<style scoped lang="scss">
.title-container {
  display: flex;
  align-items: center;
}

.simulator-form-container {
  background-color: white;
  padding: 2rem;
  border-radius: 4px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}
</style>
