export default defineAppConfig({
  headerProps: {
    serviceTitle: 'aides simplifiées',
    serviceDescription: 'La bonne aide, au bon moment, au bon endroit',
    logoText: ['République', 'Française'],
    quickLinks: [
      {
        label: 'Affichage',
        icon: { name: 'ri-sun-line', ssr: true },
        iconAttrs: {
          class: 'fr-icon-theme-fill',
        },
        button: true,
        onClick: () => {
          useSchemeStore().openModal()
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
