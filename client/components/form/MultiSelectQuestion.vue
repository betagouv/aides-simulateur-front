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

<style scoped lang="scss">
// Custom styling for DsfrCheckboxSet, based on dsfr rich radio button
.question-container:deep(.fr-checkbox-group) {
  label {
    --idle: transparent;
    --hover: var(--background-default-grey-hover);
    --active: var(--background-default-grey-active);

    margin-left: 0;
    padding: .75rem 1rem .75rem 2.75rem;
    background-color: var(--background-default-grey);
    background-image: linear-gradient(0deg, var(--border-default-grey), var(--border-default-grey)), linear-gradient(0deg, var(--border-default-grey), var(--border-default-grey)), linear-gradient(0deg, var(--border-default-grey), var(--border-default-grey)), linear-gradient(0deg, var(--border-default-grey), var(--border-default-grey));
    background-position: 0 0, 100% 0, 0 100%, 0 0, 1rem 50%, 1rem 50%;
    background-repeat: no-repeat, no-repeat, no-repeat, no-repeat, no-repeat, no-repeat;
    background-size: 100% 1px, 1px 100%, 100% 1px, 1px 100%, 1rem 1rem, 1rem 1rem;

    &:hover {
      background-color: var(--hover);
    }

    &:active {
      background-color: var(--active);
    }

    &::before {
      top: 50%;
      transform: translate(2.75rem, -50%);
    }
  }

  & input:checked+label {
    background-image: linear-gradient(0deg, var(--border-active-blue-france), var(--border-active-blue-france)), linear-gradient(0deg, var(--border-active-blue-france), var(--border-active-blue-france)), linear-gradient(0deg, var(--border-active-blue-france), var(--border-active-blue-france)), linear-gradient(0deg, var(--border-active-blue-france), var(--border-active-blue-france));
  }
}
</style>
