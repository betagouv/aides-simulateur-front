<script lang="ts" setup>
definePageMeta({
  layout: 'default',
})

useSeoMeta({
  title: 'Toutes les aides disponibles | Aides simplifiées',
  description: 'Découvrez toutes les aides disponibles pour vous accompagner dans vos démarches.'
})

const { data: aides } = await useAsyncData('aides', () => {
  return queryCollectionNavigation('aides', ['titre', 'type', 'montant', 'description', 'instructeur'])
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
        titre: aide.titre as string,
        type: aide.type as TypeAide,
        instructeur: aide.instructeur as string,
        montant: aide.montant as number,
        description: aide.description as string,
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
              :titre="aide.titre"
              :description="aide.description"
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
