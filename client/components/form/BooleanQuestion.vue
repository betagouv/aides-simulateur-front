<script lang="ts" setup>
defineProps<{
  question: SurveyQuestion
  modelValue: boolean | undefined
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

function handleChange (value: string | number | boolean) {
  // Convert value to boolean
  if (typeof value === 'string') {
    emit('update:modelValue', value === 'true')
  }
  else if (typeof value === 'boolean') {
    emit('update:modelValue', value)
  }
  else {
    // Handle number case by treating non-zero as true
    emit('update:modelValue', value !== 0)
  }
}
</script>

<template>
  <div class="question-container">
    <DsfrRadioButtonSet
      :options="[
        { label: 'Oui', value: 'true' },
        { label: 'Non', value: 'false' },
      ]"
      :name="question.id"
      :model-value="modelValue?.toString()"
      @update:model-value="handleChange"
    />
  </div>
</template>
