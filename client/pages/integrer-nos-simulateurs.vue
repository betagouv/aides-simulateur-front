<script lang="ts" setup>
const crumbs = [
  { text: 'Accueil', to: '/' },
  { text: 'Intégrer nos simulateurs', to: '/intégrer-nos-simulateurs' },
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
    <AsSection
      type="page-header"
    >
      <h1 class="fr-text-inverted--grey">
        <span class="as-contrast-text--highlight">
          Vous opérez une plateforme numérique :
        </span><br>intégrez un de nos simulateurs
      </h1>
    </AsSection>
  </AsBackgroundWaves>
</template>
