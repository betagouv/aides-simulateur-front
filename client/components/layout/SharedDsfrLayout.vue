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
    text: 'Qui sommes-nous ?',
    to: 'https://beta.gouv.fr/startups/droit-data-gouv-fr-simulateurs-de-droits.html',
    target: '_blank',
  },
]

const noticeMessage = 'Ce site est en cours de développement. Certaines fonctionnalités peuvent ne pas être disponibles ou ne pas fonctionner correctement.'
</script>

<template>
  <DsfrSkipLinks :links="skipLinks" />
  <DsfrHeader
    v-if="headerProps"
    v-bind="headerProps"
  >
    <template #mainnav>
      <DsfrNavigation
        v-if="navItems?.length > 0"
        :nav-items="navItems"
      />
    </template>
  </DsfrHeader>
  <DsfrNotice
    v-if="noticeMessage"
    :title="noticeMessage"
  />
  <main
    id="content"
    role="main"
    tabindex="-1"
  >
    <slot />
  </main>
  <DsfrFooter
    v-if="footerProps"
    id="footer"
    tabindex="-1"
    v-bind="footerProps"
  />
  <CrispButton class="crisp-button" />
  <SchemeModal />
</template>

<style scoped lang="scss">
.crisp-button {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 9999;
}
</style>
