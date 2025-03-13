<script setup lang="ts">
useSeoMeta({
  title: 'Administration des soumissions | Aides simplifiées',
  description: 'Accédez aux informations relatives aux soumissions du simulateur d\'aides.'
})
const password = ref('')
const isAuthenticated = ref(false)
const error = ref('')
const loading = ref(false)
const submissions = ref<any[]>([])
const selectedSubmission = ref<string | null>(null)
const submissionData = ref<any>(null)
const loadingSubmission = ref(false)
const activeTab = ref('answers')

// Authentification
async function authenticate () {
  if (!password.value) {
    error.value = 'Le mot de passe est requis'
    return
  }

  error.value = ''
  loading.value = true

  try {
    // Test d'authentification en chargeant les soumissions
    await loadSubmissions()
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

// Chargement des soumissions
async function loadSubmissions () {
  loading.value = true
  error.value = ''

  try {
    const response = await $fetch('/api/admin/list-submissions', {
      method: 'POST',
      body: {
        password: password.value
      }
    })

    if (response.success) {
      submissions.value = response.files
    }
    else {
      error.value = response.error || 'Erreur lors du chargement des soumissions'
    }
  }
  catch (e: any) {
    if (e.statusCode === 401) {
      error.value = 'Mot de passe incorrect'
      isAuthenticated.value = false
    }
    else {
      error.value = 'Erreur lors du chargement des soumissions'
      console.error('Erreur de chargement:', e)
    }
  }
  finally {
    loading.value = false
  }
}

// Visualisation d'une soumission
async function viewSubmission (filename: string) {
  selectedSubmission.value = filename
  loadingSubmission.value = true

  try {
    const response = await $fetch('/api/admin/get-submission', {
      method: 'POST',
      body: {
        password: password.value,
        filename
      }
    })

    if (response.success) {
      submissionData.value = response.data
    }
    else {
      console.error('Erreur lors de la récupération de la soumission:', response.error)
      submissionData.value = null
    }
  }
  catch (e) {
    console.error('Erreur lors de la récupération de la soumission:', e)
    submissionData.value = null
  }
  finally {
    loadingSubmission.value = false
  }
}

// Téléchargement d'une soumission
function downloadSubmission () {
  if (!submissionData.value) { return }

  const json = JSON.stringify(submissionData.value, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.href = url
  a.download = selectedSubmission.value || 'submission.json'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// Utilitaires de formatage
function formatDate (dateStr: string) {
  const date = new Date(dateStr)
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

function formatFileSize (size: number) {
  if (size < 1024) { return `${size} o` }
  if (size < 1024 * 1024) { return `${(size / 1024).toFixed(1)} Ko` }
  return `${(size / (1024 * 1024)).toFixed(1)} Mo`
}

function formatJson (data: any) {
  return JSON.stringify(data, null, 2)
}

function getSimulateurId (filename: string) {
  // Extraire l'ID du simulateur du nom de fichier (format: simulateurId_timestamp_randomString.json)
  const parts = filename.split('_')
  return parts[0] || 'inconnu'
}

// Déconnexion
function logout () {
  if (process.client) {
    // Supprimer le mot de passe de sessionStorage
    sessionStorage.removeItem('admin_password')
  }
  // Réinitialiser l'état d'authentification
  isAuthenticated.value = false
  password.value = ''
  submissions.value = []
  selectedSubmission.value = null
  submissionData.value = null
}

// Chargement initial si le mot de passe est stocké dans sessionStorage
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
    <h1>Administration des soumissions</h1>

    <!-- Connexion -->
    <div
      v-if="!isAuthenticated"
      class="fr-card fr-card--shadow fr-p-3w"
    >
      <h2 class="fr-h4">
        Connexion
      </h2>
      <p>Veuillez saisir le mot de passe pour accéder à l'administration</p>
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

    <!-- Liste des soumissions -->
    <div v-else>
      <div class="fr-mb-2w fr-grid-row fr-grid-row--middle fr-grid-row--gutters">
        <div class="fr-col">
          <DsfrButton
            label="Actualiser"
            @click="loadSubmissions"
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
        v-else-if="submissions.length === 0"
        class="fr-callout fr-py-2w"
      >
        <p>Aucune soumission trouvée.</p>
      </div>

      <div v-else>
        <table class="fr-table">
          <caption>Liste des 100 dernières soumissions</caption>
          <thead>
            <tr>
              <th scope="col">
                Simulateur
              </th>
              <th scope="col">
                Date
              </th>
              <th scope="col">
                Taille
              </th>
              <th scope="col">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="file in submissions"
              :key="file.filename"
            >
              <td>{{ getSimulateurId(file.filename) }}</td>
              <td>{{ formatDate(file.timestamp) }}</td>
              <td>{{ formatFileSize(file.size) }}</td>
              <td>
                <DsfrButton
                  label="Voir"
                  type="button"
                  secondary
                  @click="viewSubmission(file.filename)"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Modal pour afficher le détail d'une soumission -->
      <DsfrModal
        v-if="selectedSubmission"
        title="Détail de la soumission"
        :opened="!!selectedSubmission"
        @close="selectedSubmission = null"
      >
        <div
          v-if="loadingSubmission"
          class="fr-text--center fr-py-3w"
        >
          <span
            class="fr-icon-refresh-line fr-icon--lg"
            aria-hidden="true"
          /> Chargement...
        </div>
        <div v-else>
          <div class="fr-mb-2w">
            <DsfrButton
              label="Télécharger JSON"
              secondary
              @click="downloadSubmission"
            />
          </div>
          <div class="fr-tabs">
            <ul
              class="fr-tabs__list"
              role="tablist"
            >
              <li role="presentation">
                <button
                  id="tab-answers"
                  class="fr-tabs__tab"
                  :class="{ 'fr-tabs__tab--active': activeTab === 'answers' }"
                  role="tab"
                  @click="activeTab = 'answers'"
                >
                  Réponses
                </button>
              </li>
              <li role="presentation">
                <button
                  id="tab-results"
                  class="fr-tabs__tab"
                  :class="{ 'fr-tabs__tab--active': activeTab === 'results' }"
                  role="tab"
                  @click="activeTab = 'results'"
                >
                  Résultats
                </button>
              </li>
              <li role="presentation">
                <button
                  id="tab-raw"
                  class="fr-tabs__tab"
                  :class="{ 'fr-tabs__tab--active': activeTab === 'raw' }"
                  role="tab"
                  @click="activeTab = 'raw'"
                >
                  JSON brut
                </button>
              </li>
            </ul>
            <div
              class="fr-tabs__panel"
              role="tabpanel"
              :hidden="activeTab !== 'answers'"
            >
              <h3>Réponses</h3>
              <pre class="json-display">{{ formatJson(submissionData?.answers) }}</pre>
            </div>
            <div
              class="fr-tabs__panel"
              role="tabpanel"
              :hidden="activeTab !== 'results'"
            >
              <h3>Résultats</h3>
              <pre class="json-display">{{ formatJson(submissionData?.results) }}</pre>
            </div>
            <div
              class="fr-tabs__panel"
              role="tabpanel"
              :hidden="activeTab !== 'raw'"
            >
              <h3>JSON brut</h3>
              <pre class="json-display">{{ formatJson(submissionData) }}</pre>
            </div>
          </div>
        </div>
      </DsfrModal>
    </div>
  </div>
</template>

<style scoped>
.json-display {
  background-color: #f6f6f6;
  padding: 1rem;
  overflow: auto;
  max-height: 400px;
  border-radius: 4px;
  font-family: monospace;
  white-space: pre-wrap;
}
</style>
