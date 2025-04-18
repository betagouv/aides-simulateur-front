<script setup lang="ts">
import { ref } from 'vue'

useSeoMeta({
  title: 'Administration du simulateur d\'aides | Aides simplifiées',
  description: 'Accédez aux informations relatives au simulateur d\'aides.'
})

const password = ref('')
const error = ref('')

// Fonction de redirection avec mot de passe
function goToSubmissions () {
  if (!password.value) {
    error.value = 'Veuillez saisir un mot de passe'
    return
  }

  // Stocker le mot de passe dans sessionStorage au lieu de l'URL
  // sessionStorage est préféré à localStorage car les données sont effacées
  // lorsque la session de navigation se termine
  if (process.client) {
    sessionStorage.setItem('admin_password', password.value)
  }

  // Redirection vers la page des soumissions sans le mot de passe dans l'URL
  navigateTo('/admin/submissions')
}

// Fonction de redirection vers les tests
function goToTests () {
  if (!password.value) {
    error.value = 'Veuillez saisir un mot de passe'
    return
  }

  // Stocker le mot de passe dans sessionStorage
  if (process.client) {
    sessionStorage.setItem('admin_password', password.value)
  }

  // Redirection vers la page des tests
  navigateTo('/admin/tests')
}
</script>

<template>
  <div class="fr-container fr-py-4w">
    <h1>Administration du simulateur d'aides</h1>

    <div class="fr-callout fr-callout--brown fr-my-4w">
      <p class="fr-callout__title">
        Espace administrateur sécurisé
      </p>
      <p>
        Cette section est réservée aux administrateurs du simulateur et permet d'accéder aux données collectées.
      </p>
      <p>
        <i>Note : L'accès à cette interface nécessite un mot de passe d'administration défini dans les variables d'environnement.</i>
      </p>
    </div>

    <div class="fr-grid-row fr-grid-row--gutters">
      <div class="fr-col-12 fr-col-md-6">
        <div class="fr-card fr-card--shadow fr-p-3w">
          <h2 class="fr-h4">
            Accès à l'interface d'administration
          </h2>
          <p>Veuillez saisir le mot de passe administrateur pour accéder aux données</p>

          <DsfrInput
            v-model="password"
            type="password"
            label="Mot de passe"
            @keyup.enter="goToSubmissions"
          />

          <div class="fr-btns-group fr-mt-2w">
            <DsfrButton
              label="Accéder aux soumissions"
              @click="goToSubmissions"
            />
            <DsfrButton
              label="Accéder aux tests"
              secondary
              @click="goToTests"
            />
          </div>

          <p
            v-if="error"
            class="fr-error-text fr-mt-2w"
          >
            {{ error }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
code {
  background-color: #f6f6f6;
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  font-family: monospace;
}
</style>
