<script lang="ts" setup>
definePageMeta({
  layout: 'default',
  middleware: 'check-iframe-layout',
  validate: getContentRouteValidator('simulateur_id')
})

const route = useRoute()
const simulateurId = route.params.simulateur_id as string

const { data: simulateur } = useAsyncData(`simulateur-${simulateurId}`, () => {
  return queryCollection('simulateurs')
    .where('stem', '=', `simulateurs/${simulateurId}`)
    .first()
}, {
  transform: (data) => {
    return {
      id: data.id,
      title: data.titre,
      pictogram: data.pictogramme
    }
  }
})

const crumbs = computed(() => {
  if (!simulateur.value) {
    return []
  }
  return [
    { text: 'Accueil', to: '/' },
    { text: 'Simulateurs', to: '/simulateurs' },
    { text: simulateur.value.title, to: `/simulateurs/${simulateurId}` },
    { text: 'Résultats', to: `/simulateurs/${simulateurId}/resultats` }
  ]
})

const visibleTabName = ref<'montants' | 'echeances' | 'informations'>('montants')

const activeAccordion = ref<number>()
</script>

<template>
  <template v-if="simulateur">
    <BrandBackgroundContainer>
      <BreadcrumbSectionContainer :crumbs="crumbs" />
      <SimulationHeaderSection v-bind="simulateur" />
      <UserActionSectionRow>
        <article class="results fr-container--fluid">
          <header class="results__header fr-grid-row fr-grid-row--gutters">
            <div class="fr-col-9">
              <h2 class="results__title">
                Vos résultats de la simulation «&nbsp;{{ simulateur.title }}&nbsp;»
              </h2>
              <DsfrLink
                class="results__backlink"
                icon-before
                label="Reprendre mes résultats"
                :link="{
                  to: `/simulateurs/${simulateurId}`,
                }"
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
          <div class="results__content fr-mt-8w">
            <div class="results__content-resume">
              <h3>En résumé</h3>
              <DsfrSegmentedSet
                v-model="visibleTabName"
                name="resume"
                label="En résumé"
                :options="[
                  { label: 'Montants estimés', value: 'montants', icon: 'ri:money-euro-circle-line' },
                  { label: 'Échéances estimées', value: 'echeances', icon: 'ri:calendar-2-line' },
                  { label: 'Vos informations', value: 'informations', icon: 'ri:edit-box-line' },
                ]"
              />
              <div class="fr-mt-4w">
                <div v-if="visibleTabName === 'montants'">
                  <p>
                    Vous pourriez bénéficier d'une aide de <strong>1 000 €</strong> pour votre déménagement.
                  </p>
                </div>
                <div v-else-if="visibleTabName === 'echeances'">
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
            <div class="results__liste-aides fr-mt-8w">
              <h3>Les aides que nous avons identifiées</h3>
              <p>
                Selon les informations que vous avez fournies, vous pourriez être éligible à ces aides.
                Ces résultats sont basés uniquement sur les données communiquées et ne constituent pas un engagement officiel de la part des organismes mentionnés.
              </p>
            </div>
            <div class="results__liste-annexes fr-mt-8w">
              <h3>Pour aller plus loin</h3>
              <DsfrAccordionsGroup v-model="activeAccordion">
                <DsfrAccordion
                  id="accordion-1"
                  title="Comment avons nous estimé ces aides ?"
                >
                  Contenu à venir
                </DsfrAccordion>
                <DsfrAccordion
                  id="accordion-2"
                  title="Les aides auxquelles vous n’avez pas été estimé·e éligible"
                >
                  Contenu à venir
                </DsfrAccordion>
                <DsfrAccordion
                  id="accordion-3"
                  title="Textes de référence"
                >
                  Contenu à venir
                </DsfrAccordion>
              </DsfrAccordionsGroup>
            </div>
          </div>
        </article>
      </UserActionSectionRow>
    </BrandBackgroundContainer>
  </template>
</template>
