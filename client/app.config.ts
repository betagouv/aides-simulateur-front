export default defineAppConfig({
  headerProps: {
    serviceTitle: 'aides simplifiées',
    serviceDescription: 'La bonne aide, au bon endroit, au bon moment',
    logoText: ['République', 'Française'],
    quickLinks: [
      {
        label: 'À propos',
        to: '/content/apropos',
        icon: { name: 'ri-flag-line', ssr: true },
      },
      {
        label: 'Affichage',
        icon: { name: 'fr-icon-theme-fill', ssr: true },
        button: true,
        onClick: () => {
          const { isThemeModalOpen } = useDsfrScheme()
          isThemeModalOpen.value = true
        },
      }
    ],
  },
  footerProps: {
    logoText: ['République', 'Française'],
    licenceText: 'Licence ouverte 2.0',
    licenceTo: 'https://www.etalab.gouv.fr/licence-ouverte-open-licence',
    licenceName: 'Licence ouverte 2.0',
    a11yCompliance: 'partiellement conforme',
    descText: 'Description du service',
    operatorImgAlt: 'Logo de l\'opérateur',
    operatorLinkText: 'Nom de l\'opérateur',
    operatorTo: 'https://www.interieur.gouv.fr',
    homeLink: '/',
    legalLink: '/content/mentions-legales',
    personalDataLink: '/content/donnees-personnelles',
    cookiesLink: '/content/cookies',
    a11yComplianceLink: '/content/accessibilite',
  }
})
