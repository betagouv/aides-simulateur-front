<script lang="ts" setup>
import { type SurveyQuestion } from '@/stores/survey'

const props = defineProps<{
  question: SurveyQuestion
  modelValue: string[] | undefined
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string[]]
}>()

// Implement a checkbox group with DsfrCheckbox
const selectedValues = ref<string[]>(props.modelValue || [])

// Watch for external changes
watch(() => props.modelValue, (newValue) => {
  selectedValues.value = newValue || []
})

// Update parent when selection changes
function toggleOption(choiceId: string) {
  const values = [...selectedValues.value]
  const index = values.indexOf(choiceId)

  if (index === -1) {
    values.push(choiceId)
  } else {
    values.splice(index, 1)
  }

  selectedValues.value = values
  emit('update:modelValue', values)
}
</script>

<template>
  <div class="">
    <div
      v-for="choice in question.choices"
      :key="choice.id"
      class="fr-my-4v"
    >
      <DsfrCheckbox
        :id="`${question.id}-${choice.id}`"
        :name="`${question.id}-${choice.id}`"
        :label="choice.title"
        :model-value="selectedValues.includes(choice.id)"
        @update:model-value="() => toggleOption(choice.id)"
      />
    </div>
  </div>
</template>
