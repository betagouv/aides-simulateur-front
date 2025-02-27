<script setup lang="ts">
const props = defineProps<{
  question: any
}>()

const formStore = useFormStore()
const { answers, setAnswer } = formStore

const modelValue = computed({
  get: () => answers[props.question.id],
  set: (value) => setAnswer(props.question.id, value)
})
</script>

<template>
  <div class="question-container">
    <DsfrInputGroup
      v-model="modelValue"
      type="number"
      :name="question.id"
      :label="question.title"
      :hint="question.hint"
      label-visible
    />
  </div>
</template>
