<script setup lang="ts">
const props = defineProps<{
  question: any
}>()

const formStore = useFormStore()
const { answers, setAnswer } = formStore

const selectedOptions = ref<string[]>(answers[props.question.id] || [])

watch(selectedOptions, (newVal) => {
  setAnswer(props.question.id, newVal)
})
</script>

<template>
  <div class="question-container">
    <fieldset class="fr-fieldset">
      <legend class="fr-fieldset__legend">{{ question.title }}</legend>
      <p v-if="question.hint" class="fr-hint-text">{{ question.hint }}</p>

      <div class="fr-fieldset__content">
        <div v-for="option in question.options" :key="option.value" class="fr-checkbox-group">
          <input
            :id="`${question.id}-${option.value}`"
            type="checkbox"
            :name="question.id"
            :value="option.value"
            v-model="selectedOptions"
            class="fr-checkbox"
          >
          <label :for="`${question.id}-${option.value}`" class="fr-label">
            {{ option.label }}
          </label>
        </div>
      </div>
    </fieldset>
  </div>
</template>
