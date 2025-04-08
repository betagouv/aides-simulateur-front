<script lang="ts" setup>
defineProps<{
  question: SurveyQuestion
}>()

/**
 * We expose a number model up to the parent component
 */
const numberModel = defineModel<number | undefined>()

/**
 * We pass a string model down to the DSFR input component
 */
const stringModel = customRef((track, trigger) => {
  return {
    get () {
      return numberModel.value === undefined ? undefined : String(numberModel.value)
    },
    set (value: string | undefined) {
      track()
      if (value === undefined || value === '') {
        numberModel.value = undefined
      }
      else {
        numberModel.value = Number(value)
      }
      trigger()
    },
  }
})
</script>

<template>
  <DsfrInputGroup
    v-model="stringModel"
    class="fr-mb-4w"
    type="number"
    :name="question.id"
    :label="question.title"
    :label-visible="false"
  />
</template>
