<script setup lang="ts">
const { headerProps, footerProps } = useAppConfig()
const { showHeader, showFooter } = useIframeDisplay()

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

const navItems = [
  {
    text: 'Accueil',
    to: '/',
  },
  // {
  //   text: 'Simulateurs',
  //   to: '/simulateurs',
  // },
  {
    text: 'Partenaires',
    to: '/partenaires',
  },
  {
    text: 'Intégrer nos simulateurs',
    to: '/integrer-nos-simulateurs',
  },
  {
    text: 'Contact',
    to: '/contact',
  },
  {
    text: 'Qui sommes-nous ?',
    to: 'https://beta.gouv.fr/startups/droit-data-gouv-fr-simulateurs-de-droits.html',
    target: '_blank',
  },
]
</script>

<template>
  <DsfrSkipLinks :links="skipLinks" />
  <DsfrHeader
    v-if="headerProps && showHeader"
    v-bind="headerProps"
  >
    <template #mainnav>
      <DsfrNavigation
        v-if="navItems?.length > 0"
        :nav-items="navItems"
      />
    </template>
  </DsfrHeader>
  <main
    id="content"
    role="main"
    tabindex="0"
  >
    <slot />
  </main>
  <DsfrFooter
    v-if="footerProps && showFooter"
    id="footer"
    v-bind="footerProps"
    tabindex="0"
  />
  <SchemeModal />
</template>
