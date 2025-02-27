<script lang="ts" setup>
const iconName = 'ri-arrow-right-s-line'
</script>

<template>
  <BrandBackgroundContainer>
    <SectionContainer>
      <DsfrTag
        label="Approuvé"
        :icon="{ name: iconName, ssr: true }"
      />
    </SectionContainer>
  </BrandBackgroundContainer>
</template>
