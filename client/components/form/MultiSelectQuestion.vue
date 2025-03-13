<script lang="ts" setup>
const props = defineProps<{
  question: SurveyQuestion
}>()

const model = defineModel<string[]>('modelValue', { default: () => [] })

// Convert question choices to DsfrCheckboxSet options format
const checkboxOptions = computed(() => {
  return props.question.choices
    ?.map(choice => ({
      id: `${props.question.id}-${choice.id}`,
      name: `${props.question.id}-${choice.id}`,
      value: choice.id,
      label: choice.title,
    }))
    ?? []
})
</script>

<template>
  <div class="question-container">
    <DsfrCheckboxSet
      v-model="model"
      :options="checkboxOptions"
    />
  </div>
</template>
