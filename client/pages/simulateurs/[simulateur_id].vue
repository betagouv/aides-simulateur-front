<script lang="ts" setup>
import demenagementPictogram from '@/assets/custom-pictograms/demenagement.svg'

definePageMeta({
  layout: 'default',
})

const route = useRoute()
const simulateurId = ref(route.params.simulateur_id)

const simulateursProps = [
  {
    id: 'demenagement-logement',
    shortTitle: 'Déménagement & logement',
    // pictogram: '',
    title: 'Aides financières au déménagement et au logement',
  }
]

const simulateur = computed(() => {
  return simulateursProps.find(simulateur => simulateur.id === simulateurId.value)
})
</script>

<template>
  <section class="fr-background-default--blue-france fr-py-3w fr-py-md-4w">
    <div class="fr-container">
      <div class="fr-grid-row fr-grid-row--gutters">
        <div class="fr-col-12">
          <DsfrBreadcrumb
            class="fr-m-0"
            breadcrumb-id="mon-fil-dariane"
            :links="[
              { text: 'Accueil', to: '/' },
              { text: 'Simulateurs', to: '/simulateurs' },
              { text: simulateur.title, to: `/simulateurs/${simulateur.id}` },
            ]"
          />
        </div>
      </div>
      <div class="fr-grid-row fr-grid-row--gutters fr-py-2w">
        <div class="fr-col-3 fr-col-sm-2 fr-col-md-1">
          {{ demenagementPictogram }}
        </div>
        <div class="fr-col-9 fr-col-sm-10 fr-col-md-11">
          <h1 class="fr-h5 ">
            {{ simulateur.title }}
          </h1>
        </div>
      </div>
    </div>
  </section>
  <section class="fr-background-alt--blue-france fr-py-15w">
    <div class="fr-container">
      <div class="fr-grid-row fr-grid-row--gutters">
        <div class="fr-col-12 fr-col-offset-md-1 fr-col-md-10 fr-col-offset-lg-2 fr-col-lg-8">
          Simulation form for "{{ simulateur.title }}"
        </div>
      </div>
    </div>
  </section>
</template>
