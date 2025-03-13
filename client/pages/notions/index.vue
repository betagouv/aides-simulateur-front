<script lang="ts" setup>
useSeoMeta({
  title: 'Toutes les informations sur les notions | Aides simplifiées',
  description: 'Découvrez toutes les informations sur les notions pour vous accompagner dans vos démarches.'
})
definePageMeta({
  layout: 'default',
})

const { data: notions } = useAsyncData('notions', () => {
  return queryCollectionNavigation('notions', ['titre'])
}, {
  transform: (data) => {
    const notions = data?.[0]?.children || []
    return notions.map((notion) => {
      return {
        id: notion.path.split('/').pop(),
        /**
         * /!\ le champ 'titre' est défini par le rédacteur dans le fichier
         * !== du champ 'title' (qui correspond au nom dans le filesystem)
         */
        title: notion.titre,
      }
    })
  }
})

const { setBreadcrumbs } = useBreadcrumbStore()
setBreadcrumbs([
  { text: 'Accueil', to: '/' },
  { text: 'Notions', to: '/notions' },
])
</script>

<template>
  <BrandBackgroundContainer>
    <BreadcrumbSectionContainer />
    <SectionContainer type="page-header">
      <div class="fr-grid-row fr-grid-row--gutters">
        <h1 class="fr-col-12">
          Notions
        </h1>
        <template
          v-for="notion in notions"
          :key="notion.id"
        >
          <div class="fr-col-4">
            <DsfrCard
              :title="notion.titre"
              :link="`/notions/${notion.id}`"
            />
          </div>
        </template>
      </div>
    </SectionContainer>
  </BrandBackgroundContainer>
</template>
