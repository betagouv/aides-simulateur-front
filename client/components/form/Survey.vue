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
  <div
    class="survey"
    :class="{
      'survey--iframe': isIframe,
      'survey--no-iframe': !isIframe,
    }"
  >
    <component
      :is="surveyH1"
      class="fr-sr-only"
    >
      Votre simulation
    </component>

    <LoadingSpinner v-if="schemaStatus === 'pending'" />
    <DsfrAlert
      v-else-if="schemaStatus === 'error'"
      aria-live="assertive"
      type="error"
      title="Erreur lors du chargement du formulaire"
    />

    <template v-else-if="schemaStatus === 'success'">
      <!-- Choice screen for resuming or restarting -->
      <div v-if="showChoiceScreen">
        <div class="fr-card fr-p-4w">
          <component
            :is="surveyH2"
            class="fr-h4"
          >
            Vous avez déjà commencé une simulation
          </component>
          <DsfrBadge
            class="fr-mt-n1w fr-mb-2w"
            type="info"
            :label="`Progression : ${progress}%`"
          />
          <p class="fr-text--lg fr-mb-0">
            Souhaitez-vous reprendre votre simulation ou la recommencer ?
          </p>
        </div>
        <DsfrButtonGroup
          class="fr-mt-3w"
          align="right"
          size="lg"
          inline-layout-when="md"
          :buttons="[
            {
              label: 'Recommencer',
              secondary: true,
              icon: { name: 'ri:refresh-line', ssr: true },
              onClick: restartForm,
            },
            {
              label: 'Reprendre',
              iconRight: true,
              icon: { name: 'ri:arrow-right-line', ssr: true },
              onClick: resumeForm,
            },
          ]"
        />
      </div>

      <!-- Welcome screen for starting the survey -->
      <template v-else-if="showWelcomeScreen">
        <SurveyWelcomeScreen />
        <DsfrButtonGroup
          class="fr-mt-4w"
          inline-layout-when="md"
          size="lg"
          align="right"
          :buttons="[
            {
              label: 'Commencer la simulation',
              iconRight: true,
              icon: { name: 'ri:arrow-right-line', ssr: true },
              onClick: resumeForm,
            },
          ]"
        />
      </template>

      <!-- Results status panel -->
      <div
        v-else-if="resultsFetchStatus !== 'idle'"
        class="status-panel"
      >
        <LoadingSpinner
          v-if="resultsFetchStatus === 'pending'"
          text="Estimation en cours..."
          size="lg"
        />
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
.survey {

  &--iframe {
    padding-bottom: 4rem; // make sure crisp button is not overlapping our action buttons
  }
}

.status-panel {
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  min-height: 10em;
}
</style>
