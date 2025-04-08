<script lang="ts" setup>
const props = defineProps<{
  simulateurId: string
}>()
const simulateurId = toRef(() => props.simulateurId)

// Form schema loading and state management
const surveysStore = useSurveysStore()
// Get per-simulateur state
const schemaStatus = computed(() => surveysStore.getSchemaStatus(simulateurId.value))
const hasAnswers = computed(() => surveysStore.hasAnswers(simulateurId.value))
const progress = computed(() => surveysStore.getProgress(simulateurId.value))
const showWelcomeScreen = computed(() => surveysStore.getShowWelcomeScreen(simulateurId.value))
const showChoiceScreen = computed(() => surveysStore.getShowChoiceScreen(simulateurId.value))

// Form submission
const submissionStore = useSubmissionStore()
const resultsFetchStatus = computed(() => submissionStore.getSubmissionStatus(simulateurId.value))

const route = useRoute()
const forceResume = computed(() => route.query.resume === 'true')

if (forceResume.value) {
  // Resume the form if the query parameter is present
  resumeForm()
}
else {
  initSurvey()
}

// Full survey initialization, including schema loading and Matomo tracking
function initSurvey () {
  // Fetch the survey schema
  surveysStore.loadSurveySchema(simulateurId.value)
  // Track form start in Matomo
  useMatomo().trackSurveyStart(simulateurId.value)
  // Show the choice screen if there are answers
  if (hasAnswers.value) {
    surveysStore.setShowChoiceScreen(simulateurId.value, true)
    surveysStore.setShowWelcomeScreen(simulateurId.value, false)
  }
  // Show the welcome screen if there are no answers
  else {
    surveysStore.setShowChoiceScreen(simulateurId.value, false)
    surveysStore.setShowWelcomeScreen(simulateurId.value, true)
  }
}

function resumeForm () {
  submissionStore.setSubmissionStatus(simulateurId.value, 'idle')
  surveysStore.setShowChoiceScreen(simulateurId.value, false)
  surveysStore.setShowWelcomeScreen(simulateurId.value, false)
  scrollToAnchor('simulateur-title')
}

// Restart the form from the beginning
function restartForm () {
  submissionStore.setSubmissionStatus(simulateurId.value, 'idle')
  surveysStore.resetSurvey(simulateurId.value)
  surveysStore.setShowChoiceScreen(simulateurId.value, false)
  surveysStore.setShowWelcomeScreen(simulateurId.value, true)
  scrollToAnchor('simulateur-title')
}

// Submit the form for processing
function handleFormComplete () {
  const simulateurAnswers = surveysStore.getAnswers(simulateurId.value)
  submissionStore.submitForm(simulateurId.value, simulateurAnswers)
    .then((success) => {
      if (success) {
        setTimeout(() => {
          navigateTo(`/simulateurs/${simulateurId.value}/resultats#simulateur-title`)
        }, 1000)
      }
      else {
        setTimeout(() => {
          resumeForm()
        }, 1500)
      }
    })
}
onMounted(() => {
  surveysStore.onComplete(simulateurId.value, handleFormComplete)
})
onUnmounted(() => {
  surveysStore.offComplete(simulateurId.value, handleFormComplete)
})

// Heading levels based on iframe context
const { isIframe } = useIframeDisplay()
const surveyH1 = computed(() => isIframe.value ? 'h1' : 'h2')
const surveyH2 = computed(() => isIframe.value ? 'h2' : 'h3')
</script>

<template>
  <div>
    <component
      :is="surveyH1"
      class="fr-sr-only"
    >
      Votre simulation
    </component>

    <!-- Form loading status panel -->
    <template v-if="schemaStatus === 'pending'">
      <div class="status-panel fr-card fr-p-3w">
        <p class="loading-indicator fr-text--xl fr-mt-3w">
          <span
            class="fr-icon-refresh-line fr-icon fr-icon--md fr-mr-2w"
            aria-hidden="true"
          />Chargement du formulaire...
        </p>
      </div>
    </template>

    <!-- Form error status panel -->
    <div
      v-else-if="schemaStatus === 'error'"
      class="fr-card fr-py-5w fr-text--center"
    >
      <p>Erreur lors du chargement du formulaire</p>
    </div>

    <!-- Form success status -->
    <template v-else-if="schemaStatus === 'success'">
      <!-- Choice screen for resuming or restarting -->
      <div v-if="showChoiceScreen">
        <div class="fr-card fr-p-3w">
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
        <div class="fr-card fr-p-3w">
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
            En accédant à ce service, vous reconnaissez avoir pris connaissance et accepté les
            <DsfrLink
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
              @click="resumeForm"
            />
          </div>
        </div>
      </div>

      <!-- Results status panel -->
      <div
        v-else-if="resultsFetchStatus !== 'idle'"
        class="status-panel"
      >
        <p
          v-if="resultsFetchStatus === 'pending'"
          class="loading-indicator fr-text--xl fr-mt-3w"
        >
          <span
            class="fr-icon-refresh-line fr-icon fr-icon--md fr-mr-1v"
            aria-hidden="true"
          />Estimation en
          cours...
        </p>
        <DsfrBadge
          v-if="resultsFetchStatus === 'error' || resultsFetchStatus === 'success'"
          class="survey-fetch-status-badge"
          :type="({
            // idle: 'info',
            loading: 'info',
            success: 'success',
            error: 'error',
          }[resultsFetchStatus] as 'info' | 'success' | 'error')"
          :label="{
            // idle: `progression : ${progress}%`,
            loading: 'Estimation en cours...',
            success: 'Estimation terminée',
            error: 'Erreur lors de l\'estimation',
          }[resultsFetchStatus]"
        />
      </div>

      <!-- Survey form -->
      <SurveyForm
        v-else
        :simulateur-id="simulateurId"
      />
    </template>
  </div>
</template>

<style scoped lang="scss">
.status-panel {
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
