<template>
  <BrandBackgroundContainer
    textured
    blue
    subtle
  >
    <SectionContainer type="page-footer">
      <div class="fr-grid-row fr-grid-row--gutters">
        <div class="fr-col-12 fr-col-offset-md-1 fr-col-md-10 fr-col-offset-lg-2 fr-col-lg-8">
          <slot />
        </div>
      </div>
    </SectionContainer>
  </BrandBackgroundContainer>
</template>
