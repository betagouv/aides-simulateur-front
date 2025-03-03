<script lang="ts" setup>
import { type SurveyQuestion } from '@/stores/survey'

const props = defineProps<{
  question: SurveyQuestion
  modelValue: number | string | undefined
}>()

const emit = defineEmits<{
  'update:modelValue': [value: number | string]
}>()

function handleChange(value: number | string) {
  emit('update:modelValue', value)
}

console.log("--- NumberQuestion: modelValue = ", props.modelValue);
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
