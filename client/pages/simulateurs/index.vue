<script lang="ts" setup>
import { simulateurs } from '@/data/simulateurs'

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
      <div class="fr-grid-row fr-grid-row--gutters">
        <h1 class="fr-col-12">
          Simulateurs
        </h1>
        <template
          v-for="simulateur in simulateurs"
          :key="simulateur.id"
        >
          <div class="fr-col-4">
            <DsfrCard
              :title="simulateur.title"
              description=""
              :link="`/simulateurs/${simulateur.id}`"
            />
          </div>
        </template>
      </div>
    </SectionContainer>
  </BrandBackgroundContainer>
</template>
