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
  <AsBreadcrumbSection :crumbs="crumbs" />
  <AsBackgroundWaves subtle>
    <AsSection type="page-full">
      <h1>
        Contactez-nous
      </h1>
      <p class="fr-text--xl">
        Nous facilitons l’accès aux aides en vous proposant les services les plus simples et clairs possibles. Besoin d’informations ou d’assistance ? Nous sommes là pour vous aider.
      </p>
      <p class="fr-text--xl">
        Écrivez-nous à <strong>aides.simplifiees@numerique.gouv.fr</strong>
      </p>
    </AsSection>
  </AsBackgroundWaves>
</template>
