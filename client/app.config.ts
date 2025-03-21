export default defineAppConfig({
  headerProps: {
    serviceTitle: 'aides simplifiées',
    serviceDescription: 'La bonne aide, au bon moment, au bon endroit',
    logoText: ['République', 'Française'],
    quickLinks: [
      {
        label: 'Affichage',
        icon: { name: 'ri-sun-line', ssr: true },
        // iconAttrs: {
        //   class: 'fr-icon-theme-fill',
        // },
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
    descText: 'Aides simplifiées : la bonne aide, au bon moment, au bon endroit',
    operatorImgAlt: 'Logo de l\'opérateur',
    operatorLinkText: 'Nom de l\'opérateur',
    operatorTo: 'https://www.interieur.gouv.fr',
    homeLink: '/',
    legalLink: '/content/mentions-legales',
    personalDataLink: '/content/donnees-personnelles',
    cookiesLink: '/content/cookies',
    a11yComplianceLink: '/content/accessibilite',
    ecosystemLinks: [
      {
        label: 'info.gouv.fr',
        href: 'https://info.gouv.fr',
        title: 'info.gouv.fr, nouvelle fenêtre',
      },
      {
        label: 'service-public.fr',
        href: 'https://service-public.fr',
        title: 'service-public.fr, nouvelle fenêtre',
      },
      {
        label: 'legifrance.gouv.fr',
        href: 'https://legifrance.gouv.fr',
        title: 'legifrance.gouv.fr, nouvelle fenêtre',
      },
      {
        label: 'data.gouv.fr',
        href: 'https://data.gouv.fr',
        title: 'data.gouv.fr, nouvelle fenêtre',
      },
    ],
    afterMandatoryLinks: [
      {
        label: 'CGU',
        to: '/content/cgu',
      },

    ]
  }
})
