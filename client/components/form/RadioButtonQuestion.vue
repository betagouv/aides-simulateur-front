<script lang="ts" setup>
import { type SurveyQuestion } from '@/stores/survey'

const props = defineProps<{
  question: SurveyQuestion
  modelValue: string | number | boolean | undefined
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string | number | boolean]
}>()

function handleChange(value: string | number | boolean) {
  emit('update:modelValue', value)
}

console.log("--- RadioButton: modelValue = ", props.modelValue);

</script>

<template>
  <div class="question-container">
    <DsfrRadioButtonSet
      :options="question.choices?.map(choice => ({
        label: choice.title,
        value: choice.id,
      })) || []"
      :name="question.id"
      :model-value="modelValue"
      @update:model-value="handleChange"
    />
  </div>
</template>
