<script lang="ts" setup>
definePageMeta({
  layout: 'default',
})

const { data: aides } = useAsyncData('aides', () => {
  return queryCollectionNavigation('aides', ['titre', 'type', 'montant', 'resume'])
}, {
  transform: (data): RichAide => {
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
        montant: aide.montant,
        resume: aide.resume,
      }
    })
  }
})

const crumbs = computed(() => {
  return [
    { text: 'Accueil', to: '/' },
    { text: 'Aides', to: '/aides' },
  ]
})
</script>

<template>
  <BrandBackgroundContainer>
    <BreadcrumbSectionContainer :crumbs="crumbs" />
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
              :title="aide.title"
              :description="aide.resume"
              :link="`/aides/${aide.id}`"
              :type-aide="aide.type"
              :montant="aide.montant"
            />
          </div>
        </template>
      </div>
    </SectionContainer>
  </BrandBackgroundContainer>
</template>
