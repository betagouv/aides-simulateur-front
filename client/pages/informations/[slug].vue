<script lang="ts" setup>
import { useFormStore } from '@/stores/survey'
import { useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const formStore = useFormStore()
const slug = route.params.slug as string

// On pourrait ici récupérer les informations détaillées à afficher en fonction du slug
// Par exemple, en faisant un appel à une API ou en chargeant un fichier JSON

/**
 * Revenir à la simulation en restaurant la question précédente
 */
function returnToSimulation () {
  const savedQuestionId = formStore.savedQuestionId

  if (savedQuestionId) {
    // Construire l'URL du simulateur en récupérant l'ID depuis le store
    const simulateurId = formStore.surveySchema?.id

    if (simulateurId) {
      // Naviguer vers la page du simulateur
      router.push(`/simulateurs/${simulateurId}`)

      // Utiliser nextTick pour être sûr que la page est chargée avant de naviguer vers la question
      nextTick(() => {
        // Restaurer la question précédente
        formStore.navigateToQuestion(savedQuestionId)
      })
    }
  }
  else {
    // Fallback si on n'a pas de question sauvegardée
    router.push('/simulateurs')
  }
}
</script>

<template>
  <BrandBackgroundContainer>
    <SectionContainer type="page-header">
      <div class="fr-container">
        <div class="fr-grid-row fr-grid-row--gutters">
          <div class="fr-col-12">
            <!-- Bouton pour revenir à la simulation -->
            <button
              class="fr-btn fr-btn--tertiary-no-outline fr-icon-arrow-left-line fr-btn--icon-left fr-mb-2w"
              @click="returnToSimulation"
            >
              Revenir à la simulation
            </button>

            <h1 class="fr-h2">
              Informations détaillées
            </h1>

            <!-- Contenu de la page d'information -->
            <div class="fr-mt-4w">
              <p>
                Cette page contient des informations détaillées concernant la question
                "{{ slug }}".
              </p>

              <!-- Contenu spécifique au slug ici -->
              <div v-if="slug === 'situation-familiale'">
                <h2 class="fr-h4">
                  Situation familiale
                </h2>
                <p>
                  Votre situation familiale est importante pour déterminer les aides
                  auxquelles vous avez droit. Voici quelques précisions sur les différents
                  statuts :
                </p>
                <ul>
                  <li>
                    <strong>Célibataire</strong> : Vous vivez seul(e) et n'êtes pas marié(e)
                    ou pacsé(e).
                  </li>
                  <li>
                    <strong>En couple</strong> : Vous êtes marié(e), pacsé(e) ou en concubinage.
                  </li>
                  <li>
                    <strong>Séparé(e) ou divorcé(e)</strong> : Vous étiez en couple mais
                    vous êtes séparé(e) ou divorcé(e).
                  </li>
                  <li>
                    <strong>Veuf/veuve</strong> : Votre conjoint(e) est décédé(e).
                  </li>
                </ul>
              </div>
              <div v-else>
                <p>Informations génériques sur "{{ slug }}".</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SectionContainer>
  </BrandBackgroundContainer>
</template>
