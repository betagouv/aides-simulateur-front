<script lang="ts" setup>
defineProps<{
  question: SurveyQuestion
  modelValue: string | undefined
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

function handleChange (value: string) {
  emit('update:modelValue', value)
}
</script>

<template>
  <div class="question-container fr-mb-4w">
    <DsfrInputGroup
      :model-value="modelValue"
      type="date"
      :name="question.id"
      :label="question.title"
      :label-visible="false"
      @update:model-value="handleChange"
    />
  </div>
</template>
