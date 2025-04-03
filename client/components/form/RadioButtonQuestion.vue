<script lang="ts" setup>
defineProps<{
  question: SurveyQuestion
}>()

const model = defineModel<string>()
</script>

<template>
  <div class="question-container">
    <DsfrRadioButtonSet
      v-model="model"
      :name="question.id"
      :options="question.choices?.map(choice => ({
        label: choice.title,
        value: choice.id,
        svgPath: true as unknown as string, // This is a workaround to render a rich radio button
      })) || []"
    />
  </div>
</template>

<style scoped lang="scss">
.question-container:deep(.fr-radio-rich__pictogram) {
  display: none;
}
</style>
