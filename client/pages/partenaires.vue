<script setup lang="ts">
useSeoMeta({
  title: 'Devenir partenaire | Aides simplifiées',
  description: 'Facilitez l\'accès aux aides sur votre territoire. Optimisez le parcours usager du simulateur au dépôt de dossier et améliorez l\'efficacité de vos dispositifs d\'aide.'
})
definePageMeta({
  title: 'Partenaires',
})

const { setBreadcrumbs } = useBreadcrumbStore()
setBreadcrumbs([
  { text: 'Accueil', to: '/' },
  { text: 'Partenaires', to: '/partenaires' },
])
</script>

<template>
  <BrandBackgroundContainer
    textured
    contrast
  >
    <BreadcrumbSectionContainer contrast />
    <SectionContainer type="page-header">
      <h1 class="brand-contrast-text">
        <span class="brand-contrast-text--highlight">
          Vous êtes une administration&nbsp;:
        </span><br>facilitez le parcours d'accès aux aides
      </h1>
    </SectionContainer>
  </BrandBackgroundContainer>
</template>
