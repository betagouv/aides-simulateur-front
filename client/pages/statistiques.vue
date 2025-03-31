<script lang="ts" setup>
const { setBreadcrumbs } = useBreadcrumbStore()
setBreadcrumbs([
  { text: 'Accueil', to: '/' },
  { text: 'Statistiques', to: '/statistiques' },
])

useSeoMeta({
  title: 'Statistiques des simulateurs | Aides simplifiées',
  description: 'Consultez les statistiques d\'utilisation des simulateurs d\'aides'
})

// State for statistics
const statistics = ref<Record<string, {
  starts: number
  completions: number
}>>({})

// Loading state
const isLoading = ref(true)

// Fetch statistics from the API
async function fetchStatistics () {
  try {
    const response = await fetch('/api/statistics')
    statistics.value = await response.json()
  }
  catch (error) {
    console.error('Error fetching statistics:', error)
  }
  finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchStatistics()
})

const activeAccordion = ref<number>()
</script>

<template>
  <BrandBackgroundContainer
    textured
    contrast
  >
    <BreadcrumbSectionContainer contrast />
    <SectionContainer
      type="page-header"
    >
      <h1 class="brand-contrast-text">
        Statistiques des simulateurs
      </h1>
    </SectionContainer>
  </BrandBackgroundContainer>
  <BrandBackgroundContainer
    textured
    subtle
  >
    <SectionContainer
      type="page-footer"
    >
      <div
        v-if="isLoading"
        class="fr-text-center"
      >
        <DsfrSpinner />
      </div>
      <div v-else>
        <DsfrAccordionGroup
          :expanded-id="activeAccordion"
        >
          <DsfrAccordion
            v-for="(stats, simulatorId) in statistics"
            :id="`accordion-${simulatorId}`"
            :key="simulatorId"
            :title="simulatorId"
          >
            <div class="fr-grid-row fr-grid-row--gutters">
              <div class="fr-col-6">
                <div class="fr-card">
                  <div class="fr-card__body">
                    <h3>Simulations commencées</h3>
                    <p class="fr-text--xl">
                      {{ stats.starts }}
                    </p>
                  </div>
                </div>
              </div>
              <div class="fr-col-6">
                <div class="fr-card">
                  <div class="fr-card__body">
                    <h3>Simulations terminées</h3>
                    <p class="fr-text--xl">
                      {{ stats.completions }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </DsfrAccordion>
        </DsfrAccordionGroup>
      </div>
    </SectionContainer>
  </BrandBackgroundContainer>
</template>
