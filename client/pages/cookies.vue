<script setup lang="ts">
useSeoMeta({
  title: 'Cookies | Aides simplifiées',
  description: 'Gérez vos préférences de cookies pour une expérience optimale sur notre site.'
})
definePageMeta({
  title: 'Cookies',
})

const { setBreadcrumbs } = useBreadcrumbStore()
setBreadcrumbs([
  { text: 'Accueil', to: '/' },
  { text: 'Cookies', to: '/cookies' },
])
</script>

<template>
  <BrandBackgroundContainer
    textured
    subtle
  >
    <BreadcrumbSectionContainer />
    <SectionContainer type="page-header">
      <h1>
        Cookies
      </h1>
      <p>
        Nous utilisons des cookies pour améliorer votre expérience et les services disponibles sur ce site. Pour en savoir plus, visitez la page <a href="/donnees-personnelles">Politique de confidentialité et données personnelles</a>. Vous pouvez, à tout moment, avoir le contrôle sur les cookies que vous souhaitez activer.
      </p>
      <MatomoOptOut />
    </SectionContainer>
  </BrandBackgroundContainer>
</template>
