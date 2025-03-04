<script lang="ts" setup>
import { notions } from '@/data/notions'

definePageMeta({
  layout: 'default',
})
const crumbs = computed(() => {
  return [
    { text: 'Accueil', to: '/' },
    { text: 'Notions', to: '/notions' },
  ]
})
</script>

<template>
  <BrandBackgroundContainer>
    <BreadcrumbSectionContainer :crumbs="crumbs" />
    <SectionContainer type="page-header">
      <div class="fr-grid-row fr-grid-row--gutters">
        <h1 class="fr-col-12">
          Notions
        </h1>
        <template
          v-for="notion in notions"
          :key="notion.id"
        >
          <div class="fr-col-4">
            <DsfrCard
              :title="notion.title"
              :description="notion.description"
              :link="`/notions/${notion.id}`"
            />
          </div>
        </template>
      </div>
    </SectionContainer>
  </BrandBackgroundContainer>
</template>
