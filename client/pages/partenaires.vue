<script setup lang="ts">
definePageMeta({
  title: 'Partenaires',
})

const crumbs = [
  { text: 'Accueil', to: '/' },
  { text: 'Partenaires', to: '/partenaires' },
]
</script>

<template>
  <AsBackgroundWaves
    contrast
    background-color="alt--blue-france"
  >
    <AsBreadcrumbSection
      contrast
      :crumbs="crumbs"
    />
    <AsSection type="page-header">
      <h1 class="as-contrast-text">
        <span class="as-contrast-text--highlight">
          Vous êtes une administration :
        </span><br>facilitez le parcours d'accès aux aides
      </h1>
    </AsSection>
  </AsBackgroundWaves>
</template>
