<script setup lang="ts">
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
    blue
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
