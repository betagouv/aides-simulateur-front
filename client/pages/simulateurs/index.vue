<script lang="ts" setup>
definePageMeta({
  layout: 'default',
})
const crumbs = computed(() => {
  return [
    { text: 'Accueil', to: '/' },
    { text: 'Simulateurs', to: '/simulateurs' },
  ]
})
</script>

<template>
  <BrandBackgroundContainer>
    <BreadcrumbSectionContainer :crumbs="crumbs" />
    <SectionContainer type="page-header">
      <h1>
        Simulateurs
      </h1>
    </SectionContainer>
  </BrandBackgroundContainer>
</template>
