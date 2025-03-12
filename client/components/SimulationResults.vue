<script lang="ts" setup>
import type { DsfrSegmentedSetProps } from '@gouvminint/vue-dsfr'

const props = defineProps<{
  results: OpenFiscaAidesCalculationResponse
  simulateurId: string
  simulateurTitle: string
  simulationDateTime: {
    date: string
    time: string
  }
}>()

const richResults = await transformSimulationResults(props.results, props.simulateurId)

const hasAides = richResults.aides.length > 0
const hasEcheances = richResults.echeances.length > 0
const hasMontants = richResults.montants.length > 0
const hasAidesNonEligibles = richResults.aidesNonEligibles.length > 0
const hasTextesDeLoi = richResults.textesDeLoi.length > 0

const segmentedSetOptions: DsfrSegmentedSetProps['options'] = [
  /**
   * @todo Restore "Vos informations" below once the feature is implemented
   */
  // { label: 'Vos informations', value: 'informations', icon: 'ri:edit-box-line' }
]
if (hasEcheances) {
  segmentedSetOptions.unshift({ label: 'Échéances estimées', value: 'echeances', icon: 'ri:calendar-2-line' })
}
if (hasMontants) {
  segmentedSetOptions.unshift({ label: 'Montants estimés', value: 'montants', icon: 'ri:money-euro-circle-line' })
}

const visibleTabName = ref<'montants' | 'echeances' | 'informations'>('montants')

const activeAccordion = ref<number>()
</script>

<template>
  <article class="results">
    <header class="results__header fr-grid-row fr-grid-row--gutters">
      <div class="fr-col-9">
        <hgroup>
          <h2
            v-if="simulateurTitle"
            class="results__title"
          >
            Vos résultats de la simulation «&nbsp;{{ simulateurTitle }}&nbsp;»
          </h2>
          <p
            v-if="simulationDateTime.date && simulationDateTime.time"
            class="results__datetime"
            :style="{ color: 'var(--text-mention-grey)' }"
          >
            Simulation terminée le {{ simulationDateTime.date }} à {{ simulationDateTime.time }}
          </p>
        </hgroup>
        <DsfrLink
          class="results__backlink"
          icon-before
          label="Reprendre ma simulation"
          :to="`/simulateurs/${simulateurId}`"
          :icon="{ name: 'ri:arrow-left-line', ssr: true }"
        />
      </div>
      <div class="results__header-actions fr-col-3">
        <DsfrButtonGroup
          inline-layout-when="always"
          :buttons="[
            {
              label: 'Imprimer les résultats',
              icon: 'ri:printer-line',
              iconOnly: true,
              secondary: true,
            },
            {
              label: 'M\'envoyer les résultats par mail',
              icon: 'ri:mail-line',
              iconOnly: true,
            },
          ]"
        />
      </div>
    </header>
    <SectionSeparator
      fluid
      class="fr-mt-6w"
    />
    <div class="results__content fr-mt-8w">
      <div class="results__content-resume">
        <h3>1. En résumé</h3>
        <DsfrSegmentedSet
          v-if="segmentedSetOptions.length > 1"
          v-model="visibleTabName"
          name="resume"
          label="En résumé"
          :options="segmentedSetOptions"
        />
        <div class="fr-mt-4w">
          <div
            v-if="hasMontants && visibleTabName === 'montants'"
            class="fr-grid-row fr-grid-row--gutters"
          >
            <div
              v-for="montant in richResults.montants"
              :key="montant.type"
              class="fr-col-12 fr-col-sm-6 fr-col-xl-4"
            >
              <AideMontantCard v-bind="montant" />
            </div>
          </div>
          <div v-else-if="hasEcheances && visibleTabName === 'echeances'">
            <p>
              Le montant de votre aide pourrait être versé en <strong>2 fois</strong> sur une période de <strong>6 mois</strong>.
            </p>
          </div>
          <div v-else-if="visibleTabName === 'informations'">
            <p>
              Vous avez indiqué que vous déménagez pour des raisons professionnelles.
            </p>
          </div>
        </div>
      </div>
      <SectionSeparator
        fluid
        class="fr-mt-8w"
      />
      <div class="results__liste-aides fr-mt-8w">
        <template v-if="hasAides">
          <h3>2. Les aides que nous avons identifiées</h3>
          <p>
            Selon les informations que vous avez fournies, vous pourriez être éligible à ces aides.
            Ces résultats sont basés uniquement sur les données communiquées et ne constituent pas un engagement officiel de la part des organismes mentionnés.
          </p>
          <AidesList
            :aides="richResults.aides"
          />
        </template>
        <p v-else>
          Nous n'avons pas trouvé d'aides correspondant à votre situation.
        </p>
      </div>
      <SectionSeparator
        fluid
        class="fr-mt-8w"
      />
      <div class="results__liste-annexes fr-mt-8w">
        <h3>3. Pour aller plus loin</h3>
        <div class="fr-card">
          <div class="fr-card__body">
            <div class="fr-card__content">
              <DsfrAccordionsGroup v-model="activeAccordion">
                <DsfrAccordion
                  id="methodologie"
                >
                  <template #title>
                    <VIcon
                      name="ri:question-line"
                      ssr
                    />
                    <span class="fr-ml-1w">
                      Comment avons nous estimé ces aides ?
                    </span>
                  </template>
                  <template #default>
                    Contenu à venir
                  </template>
                </DsfrAccordion>
                <DsfrAccordion
                  v-if="hasAidesNonEligibles"
                  id="aides-non-eligibles"
                  title=""
                >
                  <template #title>
                    <VIcon
                      name="ri:chat-delete-line"
                      ssr
                    />
                    <span class="fr-ml-1w">
                      Les aides auxquelles vous n’avez pas été estimé·e éligible
                    </span>
                  </template>
                  <template #default>
                    <AidesList
                      :aides="richResults.aidesNonEligibles"
                    />
                  </template>
                </DsfrAccordion>
                <DsfrAccordion
                  v-if="hasTextesDeLoi"
                  id="textes-reference"
                  title="Textes de référence"
                >
                  <template #title>
                    <VIcon
                      name="ri:scales-3-line"
                      ssr
                    />
                    <span class="fr-ml-1w">
                      Textes de référence
                    </span>
                  </template>
                  <template #default>
                    Contenu à venir
                  </template>
                </DsfrAccordion>
              </DsfrAccordionsGroup>
            </div>
          </div>
        </div>
      </div>
    </div>
  </article>
</template>
