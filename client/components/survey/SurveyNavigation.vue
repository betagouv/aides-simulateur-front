<script lang="ts" setup>
defineProps<{
  buttons: DsfrButtonProps[]
}>()
</script>

<template>
  <ul
    class="survey-btns fr-btns-group fr-btns-group--lg fr-mt-4w"
    :class="{
      [`survey-btns--length-${buttons.length}`]: true,
    }"
  >
    <li
      v-for="(button, index) in buttons"
      :key="index"
      class="survey-btn"
    >
      <DsfrButton
        v-bind="button"
        size="lg"
        :buttons="buttons"
      />
    </li>
  </ul>
</template>

<style scoped lang="scss">
@use '@/styles/dsfr-spacings' as dsfr;
.survey-btns {
  justify-content: flex-end;
  .survey-btn {
    flex: 1;
  }

  &--length-1 {
    .survey-btn {
      @include dsfr.md {
        max-width: 50%;
      }
    }
  }
}
</style>
