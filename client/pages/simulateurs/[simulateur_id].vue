<script lang="ts" setup>
import { simulateurs, type Simulateur } from '@/data/simulateurs'

definePageMeta({
  layout: 'default',
})

const route = useRoute()
const simulateurId = ref(route.params.simulateur_id)

const simulateur = computed<Simulateur | undefined>(() => {
  return simulateurs.find(s => s.id === simulateurId.value)
})

// Handle simulator is not found
if (!simulateur.value) {
  throw createError({
    statusCode: 404,
    message: 'Simulateur non trouvé'
  })
}

// Load pictogram dynamically
const pictogram = ref<string | undefined>()
simulateur.value.pictogram()
  .then((svg) => {
    pictogram.value = svg.default
  })

</script>

<template>
  <section v-if="simulateur" class="fr-background-default--blue-france">
    <div class="fr-container fr-py-3w fr-py-md-4w">
      <div class="fr-grid-row fr-grid-row--gutters">
        <div class="fr-col-12">
          <DsfrBreadcrumb class="fr-m-0" breadcrumb-id="mon-fil-dariane" :links="[
            { text: 'Accueil', to: '/' },
            { text: 'Simulateurs', to: '/simulateurs' },
            { text: simulateur.title, to: `/simulateurs/${simulateur.id}` },
          ]" />
        </div>
      </div>
      <div class="fr-grid-row fr-grid-row--gutters">
        <div class="fr-col-3 fr-col-sm-2 fr-col-md-1">
          <DsfrPictogram
            v-if="pictogram"
            :svg-path="pictogram"
          />
        </div>
        <div class="title-container fr-col-9 fr-col-sm-10 fr-col-md-11">
          <h1 class="fr-h5 fr-m-0">
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

<style scoped lang="scss">
.title-container {
  display: flex;
  align-items: center;
}
</style>
