<script lang="ts" setup>
import type { SurveyQuestion } from '@/stores/survey'
import { onMounted, onUnmounted, ref, watch } from 'vue'

const props = defineProps<{
  question: SurveyQuestion
  modelValue: string | undefined
  autocompleteFn?: (value: string) => Promise<Array<{ code: string, autocompletion: string, [key: string]: any }>>
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const inputValue = ref<string>(props.modelValue || '')
const suggestions = ref<Array<{ code: string, autocompletion: string, [key: string]: any }>>([])
const showSuggestions = ref(false)
const loading = ref(false)
const debounceTimeout = ref<NodeJS.Timeout | null>(null)
const selectedIndex = ref(-1)
const suggestionListRef = ref<HTMLUListElement | null>(null)

// Met à jour inputValue quand modelValue change (pour les cas où la valeur est définie en dehors)
watch(() => props.modelValue, (newValue) => {
  if (newValue !== undefined) {
    inputValue.value = newValue
  }
})

// Fonction pour gérer l'entrée de l'utilisateur
async function handleInput (event: Event) {
  const value = (event.target as HTMLInputElement).value
  inputValue.value = value

  // Émettre la valeur immédiatement (mais sans le code encore)
  emit('update:modelValue', value)

  if (value.trim() === '') {
    suggestions.value = []
    showSuggestions.value = false
    return
  }

  // Debounce la requête d'autocomplétion
  if (debounceTimeout.value) {
    clearTimeout(debounceTimeout.value)
  }

  debounceTimeout.value = setTimeout(async () => {
    if (props.autocompleteFn) {
      try {
        loading.value = true
        selectedIndex.value = -1
        const result = await props.autocompleteFn(value)
        suggestions.value = result
        showSuggestions.value = result.length > 0
      }
      catch (error) {
        console.error('Erreur lors de l\'autocomplétion:', error)
      }
      finally {
        loading.value = false
      }
    }
  }, 300) // 300ms de debounce
}

// Fonction pour sélectionner une suggestion
function selectSuggestion (suggestion: { code: string, autocompletion: string }) {
  inputValue.value = suggestion.autocompletion
  emit('update:modelValue', suggestion.code) // On émet le code comme valeur
  showSuggestions.value = false
}

// Gestion des touches clavier pour naviguer dans les suggestions
function handleKeyDown (event: KeyboardEvent) {
  if (!showSuggestions.value) { return }

  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      selectedIndex.value = Math.min(selectedIndex.value + 1, suggestions.value.length - 1)
      scrollToSelectedItem()
      break
    case 'ArrowUp':
      event.preventDefault()
      selectedIndex.value = Math.max(selectedIndex.value - 1, -1)
      scrollToSelectedItem()
      break
    case 'Enter':
      event.preventDefault()
      if (selectedIndex.value >= 0 && selectedIndex.value < suggestions.value.length) {
        selectSuggestion(suggestions.value[selectedIndex.value])
      }
      break
    case 'Escape':
      showSuggestions.value = false
      break
  }
}

// Faire défiler pour voir l'élément sélectionné
function scrollToSelectedItem () {
  if (selectedIndex.value >= 0 && suggestionListRef.value) {
    const selectedItem = suggestionListRef.value.children[selectedIndex.value] as HTMLElement
    if (selectedItem) {
      selectedItem.scrollIntoView({ block: 'nearest' })
    }
  }
}

// Fermer les suggestions si on clique ailleurs
function handleClickOutside (event: MouseEvent) {
  const target = event.target as HTMLElement
  // Vérifier si le clic est en dehors de la liste de suggestions
  if (showSuggestions.value && !target.closest('.autocomplete-container')) {
    showSuggestions.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  if (debounceTimeout.value) {
    clearTimeout(debounceTimeout.value)
  }
})
</script>

<template>
  <div class="question-container">
    <div class="autocomplete-container">
      <DsfrInputGroup
        :model-value="inputValue"
        type="text"
        :name="question.id"
        :label="question.title"
        label-visible
        @input="handleInput"
        @keydown="handleKeyDown"
      />

      <!-- Indicateur de chargement -->
      <div
        v-if="loading"
        class="loading-indicator"
      >
        <span
          class="fr-icon-refresh-line fr-icon--sm"
          aria-hidden="true"
        />
        Chargement...
      </div>

      <!-- Liste des suggestions -->
      <div
        v-if="showSuggestions"
        class="suggestions-container"
      >
        <ul
          ref="suggestionListRef"
          class="suggestions-list fr-mt-1w"
        >
          <li
            v-for="(suggestion, index) in suggestions"
            :key="suggestion.code"
            class="suggestion-item"
            :class="{ selected: index === selectedIndex }"
            @click="selectSuggestion(suggestion)"
            @mouseover="selectedIndex = index"
          >
            {{ suggestion.autocompletion }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.autocomplete-container {
  position: relative;
  width: 100%;
}

.suggestions-container {
  position: absolute;
  width: 100%;
  max-height: 200px;
  overflow-y: auto;
  background-color: white;
  border: 1px solid var(--border-default-grey);
  border-radius: 0 0 4px 4px;
  z-index: 10;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.suggestions-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.suggestion-item {
  padding: 8px 16px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.suggestion-item:hover, .suggestion-item.selected {
  background-color: var(--background-alt-grey);
}

.loading-indicator {
  position: absolute;
  right: 10px;
  bottom: 0px;
  transform: translateY(-50%);
  font-size: 0.8rem;
  color: var(--text-mention-grey);
  display: flex;
  align-items: center;
  gap: 4px;
}

.loading-indicator .fr-icon--sm {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
