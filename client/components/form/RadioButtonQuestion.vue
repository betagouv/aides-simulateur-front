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
    <DsfrRadioButtonSet
      v-model="modelValue"
      :name="question.id"
      :legend="question.title"
      :hint="question.hint"
      :options="question.options"
    />
  </div>
</template>
