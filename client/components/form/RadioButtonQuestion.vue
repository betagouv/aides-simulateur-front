<script lang="ts" setup>
import lightThemeSvg from '@gouvfr/dsfr/dist/artwork/pictograms/environment/sun.svg'

const props = defineProps<{
  question: SurveyQuestion
  modelValue: string | number | boolean | undefined
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string | number | boolean]
}>()

function handleChange (value: string | number | boolean) {
  emit('update:modelValue', value)
}

// eslint-disable-next-line no-console
console.log('--- RadioButton: modelValue = ', props.modelValue)
</script>

<template>
  <div class="question-container">
    <DsfrRadioButtonSet
      :options="question.choices?.map(choice => ({
        label: choice.title,
        value: choice.id,
        svgPath: true,
      })) || []"
      :name="question.id"
      :model-value="modelValue"
      @update:model-value="handleChange"
    />
  </div>
</template>
<style scoped lang="scss">
.question-container:deep(.fr-radio-rich__pictogram) {
  display: none;
}
</style>
