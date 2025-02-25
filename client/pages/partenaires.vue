<template>
  <AsBackgroundWaves
    contrast
    background-color="alt--blue-france"
  >
    <AsSection
      type="breadcrumb"
    >
      <div class="fr-grid-row fr-grid-row--gutters">
        <div class="fr-col-12">
          <DsfrBreadcrumb
            class="fr-m-0"
            :style="{
              '--text-mention-grey': 'var(--text-inverted-grey)',
              '--text-default-grey': 'var(--background-disabled-grey)',
            }"
            breadcrumb-id="fil-ariane"
            :links="[
              { text: 'Accueil', to: '/' },
              { text: 'Partenaires', to: '/partenaires' },
            ]"
          />
        </div>
      </div>
    </AsSection>
    <AsSection
      type="page-header"
    >
      <h1 class="fr-text-inverted--grey">
        <span class="as-contrast-text-highlight">
          Vous êtes une administration :
        </span><br>facilitez le parcours d'accès aux aides
      </h1>
    </AsSection>
  </AsBackgroundWaves>
</template>
