<script lang="ts" setup>
const props = defineProps<{
  simulateurId: string
}>()
const simulateurId = props.simulateurId

// Local state
const showChoiceScreen = ref<boolean>(false)
const showWelcomeScreen = ref<boolean>(false)

const matomo = useMatomo()
const route = useRoute()

// Form schema loading and state management
const formStore = useFormStore()
const {
  schemaState,
  answers,
  progress,
  hasAnswers,
} = storeToRefs(formStore)

// Form debugging
const surveyDebugStore = useSurveyDebugStore()
const {
  debugMode,
} = storeToRefs(surveyDebugStore)

// Form submission
const resultStore = useResultsStore()
const resultsFetchState = computed(() => resultStore.getSubmissionState(simulateurId))

// Heading levels based on iframe context
const { isIframe } = useIframeDisplay()
const surveyH1 = computed(() => isIframe.value ? 'h1' : 'h2')
const surveyH2 = computed(() => isIframe.value ? 'h2' : 'h3')

// Load form when component mounts
onMounted(async () => {
  try {
    await formStore.loadSurveySchema(simulateurId)

    // Resume the form if the query parameter is present
    const doResume = computed(() => route.query.resume === 'true')
    // Enable debug mode if the debug parameter is present
    const enableDebug = computed(() => route.query.debug === 'true')

    if (enableDebug.value && !debugMode.value) {
      surveyDebugStore.toggleDebugMode()
    }

    if (doResume.value) {
      resumeForm()
      // Remove the query param
      navigateTo({ query: { ...route.query, resume: undefined } })
    }

    handleScreens() // Moved screen-setting logic here

    // Track form start in Matomo
    matomo.trackSurveyStart(simulateurId)
  }
  catch (error) {
    console.error('Error loading form:', error)
  }
})

// Scroll to element by ID
function scrollToAnchor (anchor: string) {
  const element = document.getElementById(anchor)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}

// Start the survey
function handleStart () {
  showWelcomeScreen.value = false
  scrollToAnchor('simulateur-title')
}

// Resume an in-progress form
function resumeForm () {
  resultStore.setSubmissionState(simulateurId, 'idle')
  showChoiceScreen.value = false
  showWelcomeScreen.value = false
  scrollToAnchor('simulateur-title')
}

// Restart the form from the beginning
function restartForm () {
  formStore.resetForm()
  resultStore.setSubmissionState(simulateurId, 'idle')
  showWelcomeScreen.value = true
  showChoiceScreen.value = false
  scrollToAnchor('simulateur-title')
}

// Submit the form for processing
async function submitForm () {
  const success = await resultStore.submitForm(simulateurId, answers.value)

  if (success) {
    // Navigate to results page after a short delay
    setTimeout(() => {
      navigateTo(`/simulateurs/${simulateurId}/resultats#simulateur-title`)
    }, 1000)
  }
  else {
    // Reset on error after a short delay
    setTimeout(() => {
      resumeForm()
    }, 1500)
  }
}

function handleScreens () {
  // Decide which screen to show depending on existing answers and the 'resume' query param
  if (hasAnswers.value && route.query.resume !== 'true') {
    showChoiceScreen.value = true
    showWelcomeScreen.value = false
  }
  else if (!hasAnswers.value && route.query.resume !== 'true') {
    showChoiceScreen.value = false
    showWelcomeScreen.value = true
  }
}
</script>

<template>
  <div>
    <component
      :is="surveyH1"
      class="fr-sr-only"
    >
      Votre simulation
    </component>

    <!-- Form loading state panel -->
    <template v-if="schemaState === 'loading'">
      <div class="state-panel fr-card fr-card--shadow fr-p-3w">
        <p class="loading-indicator fr-text--xl fr-mt-3w">
          <span
            class="fr-icon-refresh-line fr-icon fr-icon--md fr-mr-2w"
            aria-hidden="true"
          />Chargement du formulaire...
        </p>
      </div>
    </template>

    <!-- Form error state panel -->
    <div
      v-else-if="schemaState === 'error'"
      class="fr-card fr-card--shadow fr-py-5w fr-text--center"
    >
      <p>Erreur lors du chargement du formulaire</p>
    </div>

    <!-- Form success state -->
    <template v-else-if="schemaState === 'success'">
      <!-- Choice screen for resuming or restarting -->
      <div v-if="showChoiceScreen">
        <div class="fr-card fr-card--shadow fr-p-3w">
          <component
            :is="surveyH2"
            class="fr-h4"
          >
            <VIcon
              name="ri:information-line"
              ssr
            />
            Vous avez un formulaire en cours
          </component>
          <DsfrBadge
            class="fr-mt-n1w fr-mb-2w"
            type="info"
            :label="`Progression : ${progress}%`"
          />
          <p class="fr-text--lg">
            Souhaitez-vous reprendre votre formulaire là où vous vous êtes arrêté ou recommencer à zéro ?
          </p>
          <div class="fr-btns-group brand-form-actions fr-mt-1w">
            <DsfrButton
              class="brand-form-actions__button"
              label="Reprendre"
              :icon="{ name: 'ri:play-line', ssr: true }"
              @click="resumeForm"
            />
            <DsfrButton
              class="brand-form-actions__button"
              label="Recommencer"
              secondary
              :icon="{ name: 'ri:restart-line', ssr: true }"
              @click="restartForm"
            />
          </div>
        </div>
      </div>

      <!-- Welcome screen for starting the survey -->
      <div v-else-if="showWelcomeScreen">
        <div class="fr-card fr-card--shadow fr-p-3w">
          <component
            :is="surveyH2"
            class="fr-h4"
          >
            <VIcon
              name="ri:information-line"
              ssr
            />
            Un simulateur en construction
          </component>
          <p>
            <span class="fr-text--bold">Bienvenue !</span>
            Ce simulateur vous permet d'estimer 5 aides financières pour le logement et le déménagement, en particulier
            destinées aux étudiants.
            <DsfrLink
              to="/aides"
              target="_blank"
              label="Consulter la liste des aides couvertes."
              :icon="{ name: 'ri:arrow-right-line', ssr: true }"
            />
          </p>
          <p>
            Nous continuons à l'améliorer. Vos retours sont précieux :
          </p>
          <ul class="fr-mt-n2w fr-mb-2w">
            <li>
              Par mail à l'adresse
              <DsfrLink
                to="mailto:aides.simplifiees@numerique.gouv.fr"
                :icon="{ name: 'ri:mail-line', ssr: true }"
                label="aides.simplifiees@numerique.gouv.fr"
              />
            </li>
            <li>
              Via
              <DsfrLink
                :icon="{ name: 'ri:external-link-line', ssr: true }"
                to="https://tally.so/r/w27b9D"
                target="_blank"
                label="le questionnaire de satisfaction"
              />
            </li>
          </ul>
          <p>
            Merci pour votre aide !
          </p>
          <p>
            En accédant à ce service, vous reconnaissez avoir pris connaissance et accepté les <DsfrLink
              :icon="{ name: 'ri:external-link-line', ssr: true }"
              to="/content/cgu"
              label="Conditions Générales d'Utilisation"
              target="_blank"
            />
          </p>

          <div class="fr-btns-group brand-form-actions">
            <DsfrButton
              class="brand-form-actions__button fr-mt-1w"
              label="Commencer la simulation"
              :icon="{ name: 'ri:play-line', ssr: true }"
              @click="handleStart"
            />
          </div>
        </div>
      </div>

      <!-- Results state panel -->
      <div
        v-else-if="resultsFetchState !== 'idle'"
        class="state-panel"
      >
        <p
          v-if="resultsFetchState === 'loading'"
          class="loading-indicator fr-text--xl fr-mt-3w"
        >
          <span
            class="fr-icon-refresh-line fr-icon fr-icon--md fr-mr-1v"
            aria-hidden="true"
          />Estimation en
          cours...
        </p>
        <DsfrBadge
          v-if="resultsFetchState === 'error' || resultsFetchState === 'success'"
          class="survey-fetch-state-badge"
          :type="({
            // idle: 'info',
            loading: 'info',
            success: 'success',
            error: 'error',
          }[resultsFetchState] as 'info' | 'success' | 'error')"
          :label="{
            // idle: `progression : ${progress}%`,
            loading: 'Estimation en cours...',
            success: 'Estimation terminée',
            error: 'Erreur lors de l\'estimation',
          }[resultsFetchState]"
        />
      </div>

      <!-- Survey form -->
      <SurveyForm
        v-else
        :simulateur-id="simulateurId"
        @complete="submitForm"
      />
    </template>
  </div>
</template>

<style scoped lang="scss">
.brand-form-actions {
  display: flex;

  &.brand-form-actions__align-end {
    justify-content: flex-end;
  }

  .brand-form-actions__button {
    flex-basis: 100%;

    @media (min-width: 36em) {
      flex-basis: calc(50% - 1rem);
    }
  }
}

.state-panel {
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  min-height: 10em;
}

.loading-indicator {
  color: var(--text-mention-grey);
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: .5rem;
}

.loading-indicator .fr-icon {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}
</style>
