<script lang="ts" setup>
definePageMeta({
  layout: 'default',
})
const crumbs = computed(() => {
  return [
    { text: 'Accueil', to: '/' },
    { text: 'Contact', to: '/contact' },
  ]
})
</script>

<template>
  <BrandBackgroundContainer
    textured
    subtle
  >
    <BreadcrumbSectionContainer :crumbs="crumbs" />
    <SectionContainer type="page-full">
      <div class="fr-grid-row fr-grid-row--gutters">
        <div class="fr-col-12">
          <h1>
            Contactez-nous
          </h1>
          <p class="fr-text--xl">
            Nous facilitons l’accès aux aides en vous proposant les services les plus simples et clairs possibles. Besoin d’informations ou d’assistance ? Nous sommes là pour vous aider.
          </p>
          <p class="fr-text--xl">
            Écrivez-nous à <strong>aides.simplifiees@numerique.gouv.fr</strong>
          </p>
        </div>
      </div>
    </SectionContainer>
  </BrandBackgroundContainer>
</template>
