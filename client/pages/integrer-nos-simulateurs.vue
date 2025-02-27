<script lang="ts" setup>
const crumbs = [
  { text: 'Accueil', to: '/' },
  { text: 'Intégrer nos simulateurs', to: '/intégrer-nos-simulateurs' },
]
</script>

<template>
  <BrandBackgroundContainer
    textured
    contrast
    blue
  >
    <BreadcrumbSectionContainer
      contrast
      :crumbs="crumbs"
    />
    <SectionContainer
      type="page-header"
    >
      <h1 class="brand-contrast-text">
        <span class="brand-contrast-text--highlight">
          Vous opérez une plateforme numérique&nbsp;:
        </span><br>intégrez un de nos simulateurs
      </h1>
    </SectionContainer>
  </BrandBackgroundContainer>
</template>
