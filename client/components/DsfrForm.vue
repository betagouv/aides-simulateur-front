<script lang="ts" setup>
const props = defineProps<{
  schema: FormSchema
}>()

const emit = defineEmits<{
  submit: [formData: Record<string, any>]
}>()

const formData = ref<Record<string, any>>({})

// Initialize form data with default values
onMounted(() => {
  props.schema
    .filter((field) => {
      return field.default !== undefined
    })
    .forEach((field) => {
      formData.value[field.key] = field.default
    })
})

function handleSubmit (event: Event) {
  event.preventDefault()
  emit('submit', formData.value)
}
</script>

<template>
  <form @submit="handleSubmit">
    <DsfrFieldset>
      <template
        v-for="field in schema"
        :key="field.name"
      >
        <div class="fr-mb-3w">
          <template v-if="field.type === 'boolean'">
            <DsfrRadioButtonSet
              :key="field.key"
              v-model="formData[field.key]"
              :legend="field.title"
              :options="[
                { label: 'Oui', value: true },
                { label: 'Non', value: false },
              ]"
            />
          </template>

          <template v-else-if="field.type === 'string' && field.choices">
            <DsfrRadioButtonSet
              v-model="formData[field.key]"
              :name="field.key"
              :legend="field.title"
              :options="field.choices"
            />
          </template>

          <template v-else-if="field.type === 'number'">
            <DsfrInputGroup
              v-model="formData[field.key]"
              type="number"
              :name="field.key"
              :label="field.title"
              label-visible
            />
          </template>
        </div>
      </template>
    </DsfrFieldset>
    <DsfrButton
      type="submit"
      label="Valider"
    />
  </form>
</template>
