<script lang="ts" setup>
import { useFormStore } from '@/stores/survey'
import { useRouter } from 'vue-router'

const props = defineProps<{
  informationLink: string
  questionId: string
}>()

const router = useRouter()
const formStore = useFormStore()

/**
 * Sauvegarde la question actuelle dans le store et navigue vers la page d'information
 */
function navigateToInformationPage () {
  // Sauvegarder la question courante dans le store pour permettre un retour facile
  formStore.saveCurrentQuestionForNavigation(props.questionId)

  // Rediriger vers la page d'information
  router.push(props.informationLink)
}
</script>

<template>
  <button
    type="button"
    class="fr-btn fr-btn--tertiary-no-outline fr-btn--sm fr-icon-information-fill info-bubble"
    aria-label="Plus d'informations sur cette question"
    @click="navigateToInformationPage"
  >
    <span class="fr-sr-only">Plus d'informations sur cette question</span>
  </button>
</template>

<style scoped>
.info-bubble {
  margin-left: 0.5rem;
  color: var(--text-action-high-blue-france);
  vertical-align: middle;
}
</style>
