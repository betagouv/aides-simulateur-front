<script setup lang="ts">
const { headerProps, footerProps } = useAppConfig()

const skipLinks = [
  {
    id: 'content',
    text: 'Accéder au contenu',
  },
  {
    id: 'footer',
    text: 'Accéder au pied de page',
  },
]
</script>

<template>
  <DsfrSkipLinks :links="skipLinks" />
  <DsfrHeader
    v-if="headerProps"
    v-bind="headerProps"
  />
  <main
    id="content"
    role="main"
    class="fr-container"
    tabindex="0"
  >
    <slot />
  </main>
  <DsfrFooter
    v-if="footerProps"
    id="footer"
    v-bind="footerProps"
    tabindex="0"
  />
  <SchemeModal />
</template>
