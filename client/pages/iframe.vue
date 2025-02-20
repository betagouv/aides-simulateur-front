<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'

// Choix des options d'affichage
const displayOptions = ref([
  { label: 'En tête seulement', value: 'header-only' },
  { label: 'Sans tête', value: 'no-header' },
  { label: 'Tête et pied de page', value: 'header-footer' }
])
const selectedDisplayOption = ref('no-header')

// Choix du simulateur
const simulators = ref([
  { label: 'Simulateur APL', value: 'test-apl' },
  { label: 'Simulateur Etudiant', value: 'test-etudiant' }
])
const selectedSimulator = ref('test-apl')

// Inclusion du script
const scriptPath = '/iframe-integration.js'
const fullScript = computed(() => {
  return `<script src="${window?.location.origin}${scriptPath}" data-display-option="${selectedDisplayOption.value}"><\/script>`
})
// Fonction pour mettre à jour l'aperçu de l'iframe
function setIframeContainer (_selectedDisplayOption: string, _selectedSimulator: string): void {
  const dest = document.getElementById('iframe-preview-container')
  if (!dest) { return }

  // Nettoyer le conteneur
  dest.innerHTML = ''

  // Créer l'iframe avec les options sélectionnées
  const iframe = document.createElement('iframe')

  const src = new URL(`${window?.location.origin}/${_selectedSimulator}?data-display-option=${_selectedDisplayOption}`)

  src.searchParams.set('iframe', 'true')
  src.searchParams.set('utm_source', `iframe@${window?.location.hostname}`)
  src.searchParams.set('utm_term', window?.location.pathname)

  // Configurer les attributs de l'iframe
  const iframeAttributes = {
    id: 'iframe-simulateur',
    src: src.toString(),
    title: 'Simulateur d\'aides',
    style: 'border: none; width: 100%; display: block; height: 700px',
    allow: 'clipboard-write',
    allowfullscreen: true,
  }

  Object.entries(iframeAttributes).forEach(([key, value]) => {
    iframe.setAttribute(key, value.toString())
  })

  dest.appendChild(iframe)
}

// Surveiller les changements d'options et de thème
watch([selectedDisplayOption, selectedSimulator], () => {
  setIframeContainer(selectedDisplayOption.value, selectedSimulator.value)
})

onMounted(() => {
  setIframeContainer(selectedDisplayOption.value, selectedSimulator.value)
})
</script>

<template>
  <div class="fr-container fr-pt-12v">
    <article class="fr-article ">
      <h1>Intégrez le simulateur sur votre site</h1>

      <p>Notre simulateur d'aides est intégrable de manière transparente en ajoutant une simple ligne de code à votre page web.</p>
      <p>
        Le script de son intégration est accessible
        <a
          href="https://github.com/betagouv/aides-simulateur-front/blob/main/client/public/iframe-integration.js"
          target="_blank"
        >sur le dépôt hébergeant notre code </a>.
      </p>

      <h2>Code d'intégration</h2>
      <p>Voici le code à copier-coller sur votre site :</p>
      <DsfrCallout>
        <code class="fr-text--sm">{{ fullScript }}</code>
      </DsfrCallout>

      <div class="fr-form-group fr-mt-4w">
        <div class="fr-grid-row">
          <div>
            <DsfrFieldset
              legend="Options d'affichage"
              legend-class="fr-text--regular"
              inline
            >
              <div class="fr-fieldset__content">
                <DsfrRadioButtonSet
                  id="display-options-radio"
                  v-model="selectedDisplayOption"
                  :options="displayOptions"
                  name="display-options"
                  :inline="true"
                />
              </div>
            </DsfrFieldset>
          </div>

          <div class="fr-ml-8w">
            <DsfrFieldset
              legend="Thème d'affichage"
              legend-class="fr-text--regular"
              inline
            >
              <DsfrRadioButtonSet
                id="simulator-options-radio"
                v-model="selectedSimulator"
                :options="simulators"
                name="simulator-options"
                :inline="true"
              />
            </DsfrFieldset>
          </div>
        </div>
      </div>

      <h2>Prévisualisation</h2>
      <div
        id="iframe-preview-container"
        class="fr-mt-4w"
      />

      <h2>Personnalisation</h2>
      <p>
        Si vous souhaitez une intégration personnalisée du simulateur, vous pouvez
        contacter notre équipe à l'adresse
        <a href="mailto:contact@aides-simplifiees.fr">contact@aides-simplifiees.fr</a>.
      </p>
    </article>
  </div>
</template>
