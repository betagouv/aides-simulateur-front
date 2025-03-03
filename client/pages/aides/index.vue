<script lang="ts" setup>
import { aides } from '@/data/aides'

definePageMeta({
  layout: 'default',
})
const crumbs = computed(() => {
  return [
    { text: 'Accueil', to: '/' },
    { text: 'Aides', to: '/aides' },
  ]
})
</script>

<template>
  <BrandBackgroundContainer>
    <BreadcrumbSectionContainer :crumbs="crumbs" />
    <SectionContainer type="page-header">
      <div class="fr-grid-row fr-grid-row--gutters">
        <h1 class="fr-col-12">
          Aides
        </h1>
        <template
          v-for="aide in aides"
          :key="aide.id"
        >
          <div class="fr-col-4">
            <AideCard
              :title="aide.title"
              :description="aide.description"
              :link="`/aides/${aide.id}`"
              :type-aide="aide.type"
              :montant="aide.montant"
            />
          </div>
        </template>
      </div>
    </SectionContainer>
  </BrandBackgroundContainer>
</template>
