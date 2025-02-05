<script lang="ts" setup>
function handleSubmit (formData: Record<string, unknown>) {
  console.log(formData)
}
</script>

<template>
  <div>
    <h1 class="fr-title">
      Éligibilité aux APL
    </h1>
    <div class="form-container">
      <DsfrForm
        :schema="aplFormSchema"
        @submit="handleSubmit"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.form-container {
  margin: 4rem auto;
  max-width: 600px;
  max-height: 500px;
  overflow: auto;
}
</style>
