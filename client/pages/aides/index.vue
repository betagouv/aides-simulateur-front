<script lang="ts" setup>
useSeoMeta({
  title: 'Toutes les aides disponibles | Aides simplifiées',
  description: 'Découvrez toutes les aides disponibles pour vous accompagner dans vos démarches.'
})

definePageMeta({
  layout: 'default',
})

const { data: aides } = await useAsyncData('aides', () => {
  return queryCollectionNavigation('aides', ['titre', 'type', 'montant', 'resume', 'instructeur'])
}, {
  transform: (data) => {
    const aides = data?.[0]?.children || []
    return aides.map((aide) => {
      return {
        id: aide.path.split('/').pop(),
        /**
         * /!\ le champ 'titre' est défini par le rédacteur dans le fichier
         * !== du champ 'title' (qui correspond au nom dans le filesystem)
         */
        title: aide.titre,
        type: aide.type,
        instructeur: aide.instructeur,
        montant: aide.montant,
        resume: aide.resume,
      }
    })
  }
})

const { setBreadcrumbs } = useBreadcrumbStore()
setBreadcrumbs([
  { text: 'Accueil', to: '/' },
  { text: 'Aides', to: '/aides' },
])
</script>

<template>
  <BrandBackgroundContainer>
    <BreadcrumbSectionContainer />
    <SectionContainer type="page-header">
      <div class="fr-grid-row fr-grid-row--gutters">
        <h1 class="fr-col-12">
          Aides
        </h1>
        <template
          v-for="aide in aides"
          :key="aide.id"
        >
          <div class="fr-col-12 fr-col-sm-6 fr-col-md-4">
            <AideCard
              :title="aide.titre"
              :description="aide.resume"
              :link="`/aides/${aide.id}`"
              :instructeur="aide.instructeur"
              :type-aide="aide.type"
              :montant="aide.montant"
            />
          </div>
        </template>
      </div>
    </SectionContainer>
  </BrandBackgroundContainer>
</template>
