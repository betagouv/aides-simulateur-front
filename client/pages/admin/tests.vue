<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

useSeoMeta({
  title: 'Tests du simulateur | Aides simplifiées',
  description: 'Interface de test pour le simulateur d\'aides.'
})

// Authentication
const password = ref('')
const isAuthenticated = ref(false)
const error = ref('')
const loading = ref(false)

// Tests data
const testsData = ref<any>(null)
const selectedTest = ref<any>(null)

// Test execution
const testRunning = ref(false)
const runningTestId = ref<string | null>(null)
const testResults = ref<any>(null)
const resultComparison = ref<any>(null)

// Editor state
const editMode = ref(false)
const editedAnswers = ref('')

// Tests table configuration
const testsTableTitle = 'Tests disponibles dans le simulateur'

// Comparison table configuration
const comparisonTableTitle = 'Comparaison des résultats'
const comparisonTableHeaders = ['Aide', 'Résultat attendu', 'Résultat obtenu', 'Statut']

// Compute les données de lignes pour le tableau de comparaison
const comparisonTableRows = computed(() => {
  if (!resultComparison.value || !resultComparison.value.details) { return [] }

  return Object.entries(resultComparison.value.details).map(([aideId, detail]: [string, any]) => {
    const isMatch = detail.match

    return [
      aideId,
      detail.expected,
      detail.actual,
      isMatch ? 'Correct' : 'Incorrect',
    ]
  })
})

// Authentication
async function authenticate () {
  if (!password.value) {
    error.value = 'Le mot de passe est requis'
    return
  }

  error.value = ''
  loading.value = true

  try {
    // Try to fetch tests data to validate authentication
    await loadTests()
    isAuthenticated.value = true
  }
  catch (e: any) {
    if (e.statusCode === 401) {
      error.value = 'Mot de passe incorrect'
    }
    else {
      error.value = 'Erreur lors de l\'authentification'
      console.error('Erreur d\'authentification:', e)
    }
    isAuthenticated.value = false
  }
  finally {
    loading.value = false
  }
}

// Load test data
async function loadTests () {
  loading.value = true
  error.value = ''

  try {
    const response = await $fetch<{
      success: boolean
      data?: any
      error?: string
    }>('/api/admin/get-tests', {
      method: 'POST',
      body: {
        password: password.value
      }
    })

    if (response.success && response.data) {
      testsData.value = response.data
    }
    else {
      error.value = response.error || 'Erreur lors du chargement des tests'
    }
  }
  catch (e: any) {
    if (e.statusCode === 401) {
      error.value = 'Mot de passe incorrect'
      isAuthenticated.value = false
    }
    else {
      error.value = 'Erreur lors du chargement des tests'
      console.error('Erreur de chargement:', e)
    }
  }
  finally {
    loading.value = false
  }
}

// Run a specific test
async function runTest (test: any) {
  selectedTest.value = test
  testRunning.value = true
  runningTestId.value = test.id
  testResults.value = null
  resultComparison.value = null
  error.value = ''

  try {
    // Use the same calculation logic as in Survey.vue
    const answers = test.answers
    const questionsToApi = test.questionsToApi || [
      'locapass-eligibilite',
      'mobilite-master-1',
      'mobilite-parcoursup',
      'aide-personnalisee-logement',
      'garantie-visale-eligibilite',
      'garantie-visale'
    ]

    // Call the OpenFisca calculation
    const request = buildRequest(answers, questionsToApi)
    const openfiscaResponse = await fetchOpenFiscaFranceCalculation(request)

    // Extract results
    const results = extractAidesResults(openfiscaResponse, questionsToApi)
    testResults.value = results

    // Compare with expected results
    resultComparison.value = compareResults(results, test.results)

    // Initialize editor with formatted JSON
    editedAnswers.value = JSON.stringify(answers, null, 2)
  }
  catch (e: any) {
    console.error('Erreur lors de l\'exécution du test:', e)
    error.value = `Erreur lors de l'exécution du test: ${e.message || e}`
  }
  finally {
    testRunning.value = false
    runningTestId.value = null
  }
}

// Run test with edited answers
async function runEditedTest () {
  if (!selectedTest.value) { return }

  testRunning.value = true
  testResults.value = null
  error.value = ''

  try {
    // Parse edited answers
    const answers = JSON.parse(editedAnswers.value)
    const questionsToApi = selectedTest.value.questionsToApi || [
      'locapass-eligibilite',
      'mobilite-master-1',
      'mobilite-parcoursup',
      'aide-personnalisee-logement',
      'garantie-visale-eligibilite',
      'garantie-visale'
    ]

    // Call the OpenFisca calculation
    const request = buildRequest(answers, questionsToApi)
    const openfiscaResponse = await fetchOpenFiscaFranceCalculation(request)

    // Extract results
    const results = extractAidesResults(openfiscaResponse, questionsToApi)
    testResults.value = results

    // Don't compare with expected results - just show the results
  }
  catch (e: any) {
    console.error('Erreur lors de l\'exécution du test modifié:', e)

    if (e instanceof SyntaxError) {
      error.value = `Erreur de syntaxe JSON: ${e.message}`
    }
    else {
      error.value = `Erreur lors de l'exécution du test: ${e.message || e}`
    }
  }
  finally {
    testRunning.value = false
  }
}

// Toggle edit mode
function toggleEditMode () {
  editMode.value = !editMode.value

  if (editMode.value && selectedTest.value) {
    // Initialize with current answers when entering edit mode
    editedAnswers.value = JSON.stringify(selectedTest.value.answers, null, 2)
  }
}

// Compare actual results with expected results
function compareResults (actual: any, expected: any) {
  if (!expected || !actual) {
    return { success: false, message: 'Données manquantes pour la comparaison' }
  }

  const comparison = {
    success: true,
    differences: [] as any[],
    details: {} as Record<string, { expected: any, actual: any, match: boolean }>
  }

  // Compare each aide
  Object.keys({ ...expected, ...actual }).forEach((aideId) => {
    const expectedValue = expected[aideId]
    const actualValue = actual[aideId]

    const expectedAmount = typeof expectedValue === 'object' ? expectedValue.amount : expectedValue
    const actualAmount = typeof actualValue === 'object' ? actualValue.amount : actualValue

    const isMatch = expectedAmount === actualAmount

    comparison.details[aideId] = {
      expected: expectedAmount,
      actual: actualAmount,
      match: isMatch
    }

    if (!isMatch) {
      comparison.success = false
      comparison.differences.push({
        aideId,
        expected: expectedAmount,
        actual: actualAmount
      })
    }
  })

  return comparison
}

// Format comparison result into a string
function getComparisonSummary (comparison: any) {
  if (!comparison) { return '' }

  if (comparison.success) {
    return 'Test réussi ! Les résultats correspondent aux attentes.'
  }
  else {
    return `Test échoué. ${comparison.differences.length} différence(s) trouvée(s).`
  }
}

// Déconnexion
function logout () {
  if (process.client) {
    sessionStorage.removeItem('admin_password')
  }
  isAuthenticated.value = false
  password.value = ''
  testsData.value = null
  selectedTest.value = null
  testResults.value = null
}

// Load stored password if available
onMounted(() => {
  if (process.client) {
    const storedPassword = sessionStorage.getItem('admin_password')
    if (storedPassword) {
      password.value = storedPassword
      authenticate()
    }
  }
})
</script>

<template>
  <div class="fr-container fr-py-4w">
    <h1>Tests du simulateur</h1>

    <!-- Connexion -->
    <div
      v-if="!isAuthenticated"
      class="fr-card fr-card--shadow fr-p-3w"
    >
      <h2 class="fr-h4">
        Connexion
      </h2>
      <p>Veuillez saisir le mot de passe pour accéder à l'interface de test</p>
      <DsfrInput
        v-model="password"
        type="password"
        label="Mot de passe"
        @keyup.enter="authenticate"
      />
      <DsfrButton
        label="Se connecter"
        class="fr-mt-2w"
        @click="authenticate"
      />
      <p
        v-if="error"
        class="fr-error-text fr-mt-2w"
      >
        {{ error }}
      </p>
    </div>

    <!-- Interface de test -->
    <div v-else>
      <div class="fr-mb-2w fr-grid-row fr-grid-row--middle fr-grid-row--gutters">
        <div class="fr-col">
          <DsfrButton
            label="Recharger les tests"
            @click="loadTests"
          />
        </div>
        <div class="fr-col-auto">
          <DsfrButton
            label="Se déconnecter"
            secondary
            @click="logout"
          />
        </div>
      </div>

      <!-- Résultats détaillés du test sélectionné -->
      <div
        v-if="selectedTest"
        class="fr-card fr-card--shadow fr-mb-3w"
      >
        <div class="fr-card__body">
          <div class="fr-card__content">
            <div
              v-if="resultComparison"
              :class="`fr-alert fr-alert--${resultComparison.success ? 'success' : 'error'} fr-my-2w`"
            >
              <p>{{ getComparisonSummary(resultComparison) }}</p>
            </div>

            <div
              v-if="testRunning"
              class="fr-text--center fr-py-3w"
            >
              <span
                class="fr-icon-refresh-line fr-icon--lg"
                aria-hidden="true"
              /> Exécution du test...
            </div>

            <div
              v-else-if="error"
              class="fr-alert fr-alert--error fr-my-3w"
            >
              <p>{{ error }}</p>
            </div>

            <div v-else-if="testResults">
              <!-- Résultats du test -->
              <div class="fr-grid-row fr-grid-row--gutters">
                <div class="fr-col-12">
                  <h3 class="fr-h5">
                    Résultats du test
                  </h3>
                  <p>{{ selectedTest.description }}</p>
                  <pre class="json-display">{{ JSON.stringify(testResults, null, 2) }}</pre>
                </div>
              </div>

              <!-- Éditeur -->
              <div class="fr-grid-row fr-grid-row--gutters fr-mt-2w">
                <div class="fr-col-12">
                  <h3 class="fr-h5">
                    Données d'entrée du test
                  </h3>

                  <div class="fr-mb-2w">
                    <DsfrButton
                      v-if="!editMode"
                      label="Modifier les données d'entrée"
                      secondary
                      icon="ri:edit-line"
                      @click="toggleEditMode"
                    />
                    <div
                      v-else
                      class="fr-btns-group"
                    >
                      <DsfrButton
                        label="Exécuter le test modifié"
                        icon="ri:play-line"
                        @click="runEditedTest"
                      />
                      <DsfrButton
                        label="Annuler l'édition"
                        secondary
                        icon="ri:close-line"
                        @click="toggleEditMode"
                      />
                    </div>
                  </div>

                  <div v-if="!editMode">
                    <pre class="json-display">{{ JSON.stringify(selectedTest.answers, null, 2) }}</pre>
                  </div>
                  <div
                    v-else
                    class="fr-input-group"
                  >
                    <label
                      class="fr-label"
                      for="editor-answers"
                    >Éditeur JSON (answers)</label>
                    <textarea
                      id="editor-answers"
                      v-model="editedAnswers"
                      class="fr-input json-editor"
                      spellcheck="false"
                    />
                  </div>
                </div>
              </div>

              <!-- Comparaison (seulement quand ce n'est pas en mode édition) -->
              <div
                v-if="resultComparison && !editMode"
                class="fr-grid-row fr-grid-row--gutters fr-mt-2w"
              >
                <div class="fr-col-12">
                  <h3 class="fr-h5">
                    Comparaison avec les résultats attendus
                  </h3>

                  <DsfrTable
                    :title="comparisonTableTitle"
                    :headers="comparisonTableHeaders"
                    :rows="comparisonTableRows"
                    :no-caption="true"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Liste des tests -->
      <div
        v-if="loading"
        class="fr-text--center fr-py-3w"
      >
        <span
          class="fr-icon-refresh-line fr-icon--lg"
          aria-hidden="true"
        /> Chargement...
      </div>

      <div
        v-else-if="!testsData || testsData.length === 0"
        class="fr-callout fr-py-2w"
      >
        <p>Aucun test trouvé dans le schéma du formulaire. Vous pouvez ajouter des tests dans le fichier <code>client/public/forms/demenagement-logement.json</code> sous la clé <code>tests</code>.</p>
      </div>

      <div v-else-if="!selectedTest">
        <div class="fr-card fr-card--shadow fr-mb-3w">
          <div class="fr-card__body">
            <div class="fr-card__content">
              <h3 class="fr-h5">
                {{ testsTableTitle }}
              </h3>
              <div class="fr-grid-row fr-grid-row--gutters test-list">
                <div
                  v-for="test in testsData"
                  :key="test.id"
                  class="fr-col-12 fr-col-md-6 fr-col-lg-4"
                >
                  <div class="fr-card fr-card--shadow fr-card--grey">
                    <div class="fr-card__body">
                      <div class="fr-card__content">
                        <h3 class="fr-card__title">
                          <DsfrTag>{{ test.id }}</DsfrTag>
                        </h3>
                        <p class="fr-card__desc">
                          {{ test.description }}
                        </p>
                        <div class="fr-card__actions">
                          <DsfrButton
                            v-if="runningTestId !== test.id"
                            label="Lancer le test"
                            secondary
                            icon="ri:play-line"
                            size="sm"
                            @click="runTest(test)"
                          />
                          <div
                            v-else
                            class="fr-loader"
                            aria-busy="true"
                            aria-label="Chargement en cours"
                          >
                            <span class="fr-loader__text">Exécution en cours...</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        v-else
        class="fr-mb-3w"
      >
        <DsfrButton
          label="Retour à la liste des tests"
          secondary
          icon="ri:arrow-left-line"
          @click="selectedTest = null; testResults = null"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.json-display {
  background-color: #f6f6f6;
  padding: 1rem;
  overflow: auto;
  max-height: 600px;
  border-radius: 4px;
  font-family: monospace;
  white-space: pre-wrap;
}

.json-editor {
  font-family: monospace;
  min-height: 600px;
  white-space: pre;
}

:deep(.success) {
  color: var(--success-425-625);
  background-color: var(--success-950-100);
}

:deep(.error) {
  color: var(--error-425-625);
  background-color: var(--error-950-100);
}

.test-list .fr-card {
  height: 100%;
  transition: transform 0.2s ease-in-out;
}

.test-list .fr-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-overlap);
}

.test-list .fr-card__actions {
  margin-top: 1rem;
}

.test-list .fr-loader {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 38px; /* Hauteur approximative du bouton pour éviter les sauts */
}

.test-list .fr-loader .fr-loader__text {
  font-size: 0.875rem;
  color: var(--text-action-high-blue-france);
}
</style>
