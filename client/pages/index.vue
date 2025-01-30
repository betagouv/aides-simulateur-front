<script setup lang="ts">
definePageMeta({
  layout: 'default',
})

useHead({ title: 'Page d’accueil - Gabarit de démarrage VueDsfr' })
</script>

<template>
  <div class="fr-container fr-mb-5w">
    <h1 class="fr-mt-3w fr-mt-md-5w fr-mb-5w">
      Accueil
    </h1>

    <p>
      <NuxtLink to="/content/apropos">
        À propos
      </NuxtLink>
    </p>
  </div>
</template>
