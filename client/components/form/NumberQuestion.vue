<script lang="ts" setup>
defineProps<{
  question: SurveyQuestion
  modelValue: number | undefined
}>()

const emit = defineEmits<{
  'update:modelValue': [value: number | undefined]
}>()

function handleChange (value: number | string) {
  // Handle empty input
  if (value === '' || value === null || value === undefined) {
    emit('update:modelValue', undefined)
    return
  }

  // Convert string value to number
  if (typeof value === 'string') {
    const numValue = Number.parseFloat(value)
    if (!Number.isNaN(numValue)) {
      emit('update:modelValue', numValue)
    }
  }
  else if (typeof value === 'number') {
    emit('update:modelValue', value)
  }
}
</script>

<template>
  <div class="question-container">
    <DsfrInputGroup
      :model-value="modelValue"
      type="number"
      :name="question.id"
      :label="question.title"
      label-visible
      @update:model-value="handleChange"
    />
  </div>
</template>
