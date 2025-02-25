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
    <AsBreadcrumbSection :crumbs="crumbs" />
    <AsSection type="page-header">
        <h1>
            Simulateurs
        </h1>
    </AsSection>
</template>
