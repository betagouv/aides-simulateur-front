<script lang="ts" setup>
definePageMeta({
  layout: 'default',
})

const { data: simulateurs } = useAsyncData('simulateurs', () => {
  return queryCollectionNavigation('simulateurs', ['titre'])
}, {
  transform: (data) => {
    const simulateurs = data?.[0]?.children || []
    return simulateurs.map((simulateur) => {
      return {
        id: simulateur.path.split('/').pop(),
        /**
         * /!\ le champ 'titre' est défini par le rédacteur dans le fichier
         * !== du champ 'title' (qui correspond au nom dans le filesystem)
         */
        title: simulateur.titre,
      }
    })
  }
})

const { setBreadcrumbs } = useBreadcrumbStore()
setBreadcrumbs([
  { text: 'Accueil', to: '/' },
  { text: 'Simulateurs', to: '/simulateurs' },
])
</script>

<template>
  <BrandBackgroundContainer>
    <BreadcrumbSectionContainer />
    <SectionContainer type="page-header">
      <div class="fr-grid-row fr-grid-row--gutters">
        <h1 class="fr-col-12">
          Simulateurs
        </h1>
        <template
          v-for="simulateur in simulateurs"
          :key="simulateur.id"
        >
          <div class="fr-col-12 fr-col-sm-6 fr-col-md-4">
            <DsfrCard
              :title="simulateur.title"
              description=""
              :link="`/simulateurs/${simulateur.id}`"
            />
          </div>
        </template>
      </div>
    </SectionContainer>
  </BrandBackgroundContainer>
</template>
