<script setup lang="ts">
/**
 * Missing export in DSFR, so we import it manually
 * @see https://github.com/GouvernementFR/dsfr/issues/1086
 */
// import accessibilityPictogram from '@gouvfr/dsfr/dist/artwork/pictograms/accessibility/accessibility.svg'
import accessibilityPictogram from '@/assets/custom-pictograms/accessibility.svg'

import demenagementPictogram from '@/assets/custom-pictograms/demenagement.svg'
/**
 * The one exported from @gouvfr/dsfr does not render (all its siblings do though), so we import it manually
 */
// import housePictogram from '@gouvfr/dsfr/dist/artwork/pictograms/buildings/house.svg'
import housePictogram from '@/assets/custom-pictograms/house.svg'

/**
 * This one does not render
 */
import parentalitePictogram from '@/assets/custom-pictograms/parentalite.svg'

import cityHallPictogram from '@gouvfr/dsfr/dist/artwork/pictograms/buildings/city-hall.svg'
import internetPictogram from '@gouvfr/dsfr/dist/artwork/pictograms/digital/internet.svg'

import moneyPictogram from '@gouvfr/dsfr/dist/artwork/pictograms/institutions/money.svg'

definePageMeta({
  layout: 'default',
})

useHead({ title: 'Page d’accueil - Gabarit de démarrage VueDsfr' })
const baselineTitle = 'Trouvez les aides adaptées à votre situation'
const baselineSubtitle = 'Un service simple et rapide pour savoir à quelles aides vous avez droit.'

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
  <AsBackgroundWaves background-color="alt--blue-france">
    <AsSection>
      <div class="as-home-banner fr-grid-row fr-grid-row--gutters">
        <div class="as-home-banner__column fr-col-12 fr-col-lg-6">
          <h1 class="as-site-title as-title-gradient">
            {{ baselineTitle }}
          </h1>
          <p class="fr-text--xl as-home-banner__baseline">
            {{ baselineSubtitle }}
          </p>
        </div>
        <div class="as-home-banner__column fr-col-12 fr-col-md-6 fr-col-offset-xl-1 fr-col-xl-5">
          <DsfrTiles :tiles="simulationTiles" horizontal title-tag="h2" />
        </div>
      </div>
    </AsSection>
  </AsBackgroundWaves>
  <AsBackgroundWaves subtle background-color="default--grey">
    <AsSection type="grouped-first">
      <h2 class="fr-title">
        Voter pour les prochaines thématiques
      </h2>
      <div class="fr-grid-row fr-grid-row--gutters">
        <div v-for="tile in voteTiles" :key="tile.id" class="fr-col-12 fr-col-sm-6 fr-col-md-4">
          <DsfrTile :title="tile.title" title-tag="h2" horizontal :img-src="tile.imgSrc" :svg-path="tile.svgPath" />
        </div>
      </div>
      <DsfrButton type="button" label="Je vote pour les thématiques qui m’intéressent" icon="ri-arrow-right-line"
        class="fr-mt-4w" secondary icon-right @click="onClick()" />
    </AsSection>
    <AsSectionSeparator />
    <AsSection type="grouped-last">
      <h2 class="fr-title">
        Simuler toutes les aides auxquelles j’ai droit
      </h2>
      <div class="fr-grid-row fr-grid-row--gutters">
        <div class="fr-col-12 fr-col-md-6">
          <DsfrCard horizontal title="1jeune1solution.gouv.fr"
            description="Simulateur tout public avec de nombreuses aides pour les moins de 30 ans. Évaluez vos droits à plus de 1000 aides."
            link="https://www.1jeune1solution.gouv.fr/mes-aides" title-tag="h3" />
        </div>
        <div class="fr-col-12 fr-col-md-6">
          <DsfrCard horizontal title="mesdroitsociaux.gouv.fr"
            description="Simulateur tout public. Évaluez vos droits à près de 60 aides."
            link="https://www.mesdroitssociaux.gouv.fr/" title-tag="h3" />
        </div>
      </div>
    </AsSection>
  </AsBackgroundWaves>
  <AsBackgroundWaves contrast background-color="alt--blue-france">
    <AsSection>
      <hgroup class="fr-mb-6w">
        <h2 class="fr-display--xs as-contrast-text">
          <span class="as-contrast-text--highlight">
            Vous souhaitez améliorer l'accès aux aides ?
          </span><br>Aides simplifiées vous accompagne !
        </h2>
        <p class="fr-text--xl as-contrast-text">
          Aides simplifiées permet aux citoyens de trouver facilement les aides auxquelles ils sont éligibles et de
          simplifier leur parcours administratif. Nous collaborons avec des acteurs publics et des plateformes en ligne
          pour intégrer notre service et fluidifier l’accès aux dispositifs existants.
        </p>
      </hgroup>
      <div class="fr-grid-row fr-grid-row--gutters">
        <div class="fr-col-12 fr-col-md-6">
          <DsfrTile title="Vous êtes une administration ou vous opérez un service public ?"
            description="Facilitez l’accès aux aides sur votre territoire ou sur votre domaine de compétence et optimisez le passage de la simulation au dépôt de dossier."
            title-tag="h3" to="/partenaires" horizontal :svg-path="cityHallPictogram" />
        </div>
        <div class="fr-col-12 fr-col-md-6">
          <DsfrTile title="Vous êtes une plateforme en ligne ?"
            description="Offrez à vos usagers un accès simple et fiable aux aides pertinentes pour eux en intégrant nos simulateurs en quelques minutes via API ou iFrame."
            title-tag="h3" to="/integrer-nos-simulateurs" horizontal :svg-path="internetPictogram" />
        </div>
      </div>
    </AsSection>
  </AsBackgroundWaves>
</template>

<style scoped lang="scss">
.as-home-banner {
  .as-home-banner__column {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .as-site-title {
    @media (min-width: 36em) {
      font-size: 3.5rem !important;
      line-height: 4rem !important;
    }

    @media (min-width: 48em) {
      font-size: 4rem !important;
      line-height: 4.5rem !important;
    }
  }

  & p.as-home-banner__baseline {
    @media (min-width: 48em) {
      font-size: 1.8rem !important;
      line-height: 1.4 !important;
    }
  }
}
</style>
