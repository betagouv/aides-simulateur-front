<script setup lang="ts">
const props = defineProps<{
  question: any
}>()
</script>

<template>
  <div class="question-wrapper">
    <component
      :is="() => import(`./form/${question.type}Question.vue`)"
      :question="question"
    />
  </div>
</template>
