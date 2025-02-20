<script setup lang="ts">
import demenagementPictogram from '@/assets/custom-pictograms/demenagement.svg'

/**
 * This one does not render
 */
import parentalitePictogram from '@/assets/custom-pictograms/parentalite.svg'

/**
 * Missing export in DSFR, so we import it manually
 * @see https://github.com/GouvernementFR/dsfr/issues/1086
 */
// import accessibilityPictogram from '@gouvfr/dsfr/dist/artwork/pictograms/accessibility/accessibility.svg'
import accessibilityPictogram from '@/assets/custom-pictograms/accessibility.svg'

/**
 * The one exported from @gouvfr/dsfr does not render (all its siblings do though), so we import it manually
 */
// import housePictogram from '@gouvfr/dsfr/dist/artwork/pictograms/buildings/house.svg'
import housePictogram from '@/assets/custom-pictograms/house.svg'

import moneyPictogram from '@gouvfr/dsfr/dist/artwork/pictograms/institutions/money.svg'

definePageMeta({
  layout: 'default',
})

useHead({ title: 'Page d’accueil - Gabarit de démarrage VueDsfr' })
const baselineTitle = 'Les aides, en toute clarté'
const baselineSubtitle = 'Trouvez rapidement les aides auxquelles vous avez droit.'

const simulationTiles: DsfrTileProps[] = [
  {
    id: 'demenagement-logement',
    title: 'Déménagement & logement',
    to: '/simulateurs/demenagement-logement',
    svgPath: demenagementPictogram
  },
  {
    id: 'renovation-logement',
    title: 'Rénovation du logement',
    to: '#',
    svgPath: housePictogram
  }
]

const voteTiles: DsfrTileProps[] = [
  {
    id: 'parentalite',
    title: 'Devenir parent',
    to: '/vote?thematique=parentalite',
    svgPath: parentalitePictogram
  },
  {
    id: 'perte-autonomie',
    title: 'Perte d’autonomie d’un proche',
    to: '/vote?thematique=perte-autonomie',
    svgPath: accessibilityPictogram
  },
  {
    id: 'factures',
    title: 'Difficultés à payer ses factures',
    to: '/vote?thematique=factures',
    svgPath: moneyPictogram
  }
]
</script>

<template>
  <section class="fr-background-alt--blue-france fr-py-12w">
    <div class="fr-container">
      <div class="fr-grid-row fr-grid-row--gutters">
        <div class="fr-col-12 fr-col-lg-6">
          <h1>
            {{ baselineTitle }}
          </h1>
          <p>
            {{ baselineSubtitle }}
          </p>
        </div>
        <div class="fr-col-12 fr-col-lg-6">
          <h2>
            Découvrir les aides possibles en fonction de votre situation
          </h2>
          <DsfrTiles
            :tiles="simulationTiles"
            horizontal
            title-tag="h2"
          />
        </div>
      </div>
    </div>
  </section>
  <section class="fr-background-default--grey fr-pt-12w fr-pb-8w">
    <div class="fr-container">
      <h2 class="fr-title">
        Voter pour les prochaines thématiques
      </h2>
      <div class="fr-grid-row fr-grid-row--gutters">
        <div
          v-for="tile in voteTiles"
          :key="tile.id"
          class="fr-col-12 fr-col-sm-6 fr-col-md-4"
        >
          <DsfrTile
            :title="tile.title"
            title-tag="h2"
            horizontal
            :img-src="tile.imgSrc"
            :svg-path="tile.svgPath"
          />
        </div>
      </div>
      <DsfrButton
        type="button"
        label="Je vote pour les thématiques qui m’intéressent"
        icon="ri-arrow-right-line"
        class="fr-mt-4w"
        secondary
        icon-right
        @click="onClick()"
      />
    </div>
  </section>
  <section class="fr-background-default--grey">
    <div class="fr-container">
      <hr class="as-section-separator">
    </div>
  </section>
  <section class="fr-background-default--grey fr-pt-8w fr-pb-12w">
    <div class="fr-container">
      <h2 class="fr-title">
        Simuler toutes les aides auxquelles j’ai droit
      </h2>
      <div>
        <div class="fr-grid-row fr-grid-row--gutters">
          <div class="fr-col-12 fr-col-md-6">
            <DsfrCard
              horizontal
              title="1jeune1solution.gouv.fr"
              description="Simulateur tout public avec de nombreuses aides pour les moins de 30 ans. Évaluez vos droits à plus de 1000 aides."
              link="https://www.1jeune1solution.gouv.fr/mes-aides"
              title-tag="h3"
            />
          </div>
          <div class="fr-col-12 fr-col-md-6">
            <DsfrCard
              horizontal
              title="mesdroitsociaux.gouv.fr"
              description="Simulateur tout public. Évaluez vos droits à près de 60 aides."
              link="https://www.mesdroitssociaux.gouv.fr/"
              title-tag="h3"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.as-section-separator {
  border-top: 1px solid var(--border-open-blue-france);
  margin-top: 0;
  margin-bottom: 0;
  padding: 0;
}
</style>
