<script setup lang="ts">
import type { DsfrFooterProps } from '@gouvminint/vue-dsfr'

const serviceTitle = 'Service'
const serviceDescription = 'Description du service'
const logoText = ['Ministère', 'de l’Intérieur', 'et des Outre-Mer']

const quickLinks = [
  {
    label: 'Accueil',
    to: '/',
    icon: { name: 'ri-home-2-line', ssr: true },
  },
  {
    label: 'À propos',
    to: '/content/apropos',
    icon: { name: 'ri-flag-line', ssr: true },
  },
]

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

const footerProps: DsfrFooterProps = {
  logoText,
  licenceText: 'Licence ouverte 2.0',
  licenceTo: 'https://www.etalab.gouv.fr/licence-ouverte-open-licence',
  licenceName: 'Licence ouverte 2.0',
  a11yCompliance: 'partiellement conforme',
  descText: 'Description du service',
  operatorImgAlt: 'Logo de l’opérateur',
  operatorLinkText: 'Nom de l’opérateur',
  operatorTo: 'https://www.interieur.gouv.fr',
  homeLink: '/',
  legalLink: '/content/mentions-legales',
  personalDataLink: '/content/donnees-personnelles',
  cookiesLink: '/content/cookies',
  a11yComplianceLink: '/content/accessibilite',
}
</script>

<template>
  <DsfrSkipLinks :links="skipLinks" />
  <DsfrHeader
    :service-title="serviceTitle"
    :service-description="serviceDescription"
    :logo-text="logoText"
    :quick-links="quickLinks"
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
    id="footer"
    v-bind="footerProps"
    tabindex="0"
  />
</template>
