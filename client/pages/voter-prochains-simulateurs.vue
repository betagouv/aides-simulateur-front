<script lang="ts" setup>
import type { DsfrRadioButtonProps } from '@gouvminint/vue-dsfr'
/**
 * Missing export in DSFR, so we import it manually
 * @see https://github.com/GouvernementFR/dsfr/issues/1086
 */
// import accessibilityPictogram from '@gouvfr/dsfr/dist/artwork/pictograms/accessibility/accessibility.svg'
import accessibilityPictogram from '@/assets/custom-pictograms/accessibility.svg'

/**
 * This one does not render
 */
import parentalitePictogram from '@/assets/custom-pictograms/parentalite.svg'

import moneyPictogram from '@gouvfr/dsfr/dist/artwork/pictograms/institutions/money.svg'

definePageMeta({
  layout: 'default',
})
const crumbs = computed(() => {
  return [
    { text: 'Accueil', to: '/' },
    { text: 'Voter pour le prochain simulateur', to: '/voter-prochains-simulateurs' },
  ]
})

const voteOptions: Omit<DsfrRadioButtonProps, 'modelValue'>[] = [
  {
    label: 'Devenir parent',
    value: 'parentalite',
    svgPath: parentalitePictogram,
  },
  {
    label: 'Perte d’autonomie d’un proche',
    value: 'perte-autonomie',
    svgPath: accessibilityPictogram
  },
  {
    label: 'Difficultés à payer ses factures',
    value: 'factures',
    svgPath: moneyPictogram
  }
]

const selectedOption = ref<string | undefined>()
const userChoiceComment = ref<string | undefined>()
function submitVote () {
  console.log('Vote submitted', selectedOption.value, userChoiceComment.value)
}
</script>

<template>
  <AsBreadcrumbSection :crumbs="crumbs" />
  <AsSection
    type="page-header"
    background-color="default--grey"
  >
    <h1>
      Votez pour les prochains simulateurs d’aides
    </h1>
    <p class="fr-text--xl">
      Nous souhaitons prioriser les aides financières les plus utiles pour les citoyens et leurs aidants. Pour cela, nous avons besoin de votre avis. Les thématiques ci-dessous répondent-elles à vos besoins ou à ceux de votre entourage ? Votez pour celles qui vous semblent les plus importantes. Vos retours nous aideront à prioriser nos choix de conception.
    </p>
  </AsSection>
  <AsBackgroundWaves
    subtle
    background-color="alt--blue-france"
  >
    <AsSection type="user-action">
      <div class="fr-grid-row fr-grid-row--gutters">
        <div class="fr-col-12 fr-col-offset-md-1 fr-col-md-10 fr-col-offset-lg-2 fr-col-lg-8">
          <h2>
            Choisissez la thématique qui répond le mieux à vos besoins
          </h2>
          <DsfrRadioButtonSet
            v-model="selectedOption"
            :options="voteOptions"
            name="vote"
          />
          <h2>
            Dites-nous quelques mots sur votre choix
          </h2>
          <DsfrInputGroup
            v-model="userChoiceComment"
            is-textarea
            placeholder="Dites-nous quelques mots sur votre choix"
          />
          <DsfrButton
            :disabled="!selectedOption"
            :icon="{ name: 'ri-send-plane-line', ssr: true }"
            icon-right
            @click="submitVote"
          >
            Envoyer mon avis
          </DsfrButton>
        </div>
      </div>
    </AsSection>
  </AsBackgroundWaves>
</template>
