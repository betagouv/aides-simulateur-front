<script lang="ts" setup>
import { type Simulateur, simulateurs } from '@/data/simulateurs'
import { storeToRefs } from 'pinia'

definePageMeta({
  layout: 'default',
  middleware: 'check-iframe-layout',
  validate ({ params }) {
    return simulateurs.some(s => s.id === params.simulateur_id)
  }
})

const route = useRoute()
const simulateurId = ref(route.params.simulateur_id as string)
const formStore = useFormStore()
const isLoading = ref(true)

// Use storeToRefs to maintain reactivity
const {
  currentQuestion,
  currentCategory,
  nextCategory,
  formDefinition,
  answers,
  progress,
  isLastQuestion,
  currentCategoryIndex,
  totalCategoriesNumber,
} = storeToRefs(formStore)

const {
  loadFormDefinition,
  goToNextQuestion,
  goToPreviousQuestion,
  setAnswer
} = formStore

const simulateur = computed<Simulateur>(() => {
  // We can safely cast here because we validated the route
  return simulateurs.find(s => s.id === simulateurId.value) as Simulateur
})

const crumbs = computed(() => {
  return [
    { text: 'Accueil', to: '/' },
    { text: 'Simulateurs', to: '/simulateurs' },
    { text: simulateur.value.title, to: `/simulateurs/${simulateur.value.id}` }
  ]
})

// Load pictogram dynamically
const pictogram = ref<string | undefined>()
simulateur.value.pictogram()
  .then((svg) => {
    pictogram.value = svg.default
  })
  // Load form definition
onMounted(async () => {
  console.log('Loading form definition for:', simulateurId.value)
  try {
    await loadFormDefinition(simulateurId.value)
    console.log('Form definition loaded:', formDefinition.value)
    isLoading.value = false
  }
  catch (error) {
    console.error('Error loading form:', error)
    isLoading.value = false
  }
})

// Radio button selection
function handleRadioChange (value: string | number | boolean) {
  if (currentQuestion.value) {
    setAnswer(currentQuestion.value.id, value)
  }
}

// Input change handler for number and date
function handleInputChange (questionId: string, value: string | number) {
  setAnswer(questionId, value)
}

// Navigation functions
function handleNext () {
  if (isLastQuestion.value) {
    // Handle form completion, maybe redirect to results
    submitForm()
  }
  else {
    goToNextQuestion()
  }
}

function handlePrevious () {
  goToPreviousQuestion()
}

function submitForm () {
  // Process the final form data from the answers store
  console.log('Form submitted with answers:', answers.value)
  // You might want to send this data to an API, or calculate results
}
</script>

<template>
  <BrandBackgroundContainer>
    <BreadcrumbSectionContainer :crumbs="crumbs" />
    <SectionContainer
      v-if="simulateur"
      type="page-header"
    >
      <div class="fr-grid-row fr-grid-row--gutters">
        <div class="fr-col-12">
          <DsfrBreadcrumb
            class="fr-m-0"
            breadcrumb-id="mon-fil-dariane"
            :links="[
              { text: 'Accueil', to: '/' },
              { text: 'Simulateurs', to: '/simulateurs' },
              { text: simulateur.title, to: `/simulateurs/${simulateur.id}` },
            ]"
          />
        </div>
      </div>
      <div class="fr-grid-row fr-grid-row--gutters">
        <div class="fr-col-3 fr-col-sm-2 fr-col-md-1">
          <DsfrPictogram
            v-if="pictogram"
            :svg-path="pictogram"
          />
        </div>
        <div class="title-container fr-col-9 fr-col-sm-10 fr-col-md-11">
          <h1 class="fr-h5 fr-m-0">
            {{ simulateur.title }}
          </h1>
        </div>
      </div>
    </SectionContainer>
  </BrandBackgroundContainer>
  <BrandBackgroundContainer
    textured
    blue
  >
    <SectionContainer type="page-footer">
      <div class="fr-grid-row fr-grid-row--gutters">
        <!-- Progress indicator -->
        <div class="fr-col-12 fr-col-offset-md-1 fr-col-md-10 fr-col-offset-lg-2 fr-col-lg-8">
          <h1 class="fr-h3">
            Votre simulation « {{ formDefinition?.title }} »
          </h1>
          <div class="fr-stepper">
            <h2 class="fr-stepper__title">
              {{ currentCategory?.title }}
              <span class="fr-stepper__state">
                Étape {{ currentCategoryIndex }} sur {{ totalCategoriesNumber }}</span>
            </h2>
            <div
              class="fr-stepper__steps"
              data-fr-current-step="1"
              data-fr-steps="3"
            />
            <p class="fr-stepper__details">
              <span class="fr-text--bold">Étape suivante :</span>
              {{ nextCategory?.title }}
            </p>
          </div>

          <div
            v-if="!isLoading && formDefinition && currentQuestion"
            class="simulator-form-container"
          >
            <!-- Current Question -->
            <div class="fr-form-group">
              <h2 class="fr-h5">
                {{ currentQuestion?.title }}
              </h2>
              <p>{{ currentQuestion?.description }}</p>
              <template v-if="currentQuestion?.type === 'radio' && currentQuestion.choices">
                <DsfrRadioButtonSet
                  :options="currentQuestion.choices.map(choice => ({
                    label: choice.title,
                    value: choice.id,
                  }))"
                  :name="currentQuestion.id"
                  :model-value="answers[currentQuestion.id]"
                  @update:model-value="handleRadioChange"
                />
              </template>

              <!-- Add other question types as needed -->
              <template v-else-if="currentQuestion?.type === 'checkbox'">
                <!-- Checkbox implementation -->
              </template>

              <template v-else-if="currentQuestion?.type === 'number'">
                <DsfrInputGroup
                  :model-value="answers[currentQuestion.id]"
                  type="number"
                  :name="currentQuestion.id"
                  :label="currentQuestion.title"
                  label-visible
                  @update:model-value="value => handleInputChange(currentQuestion.id, value)"
                />
              </template>

              <template v-else-if="currentQuestion?.type === 'date'">
                <DsfrInputGroup
                  :model-value="answers[currentQuestion.id]"
                  type="date"
                  :name="currentQuestion.id"
                  :label="currentQuestion.title"
                  label-visible
                  @update:model-value="value => handleInputChange(currentQuestion.id, value)"
                />
              </template>
            </div>

            <!-- Navigation buttons -->
            <div class="fr-btns-group fr-btns-group--inline-reverse fr-mt-5w">
              <DsfrButton
                :label="isLastQuestion ? 'Terminer' : 'Suivant'"
                icon="ri-arrow-right-line"
                icon-right
                @click="handleNext"
              />
              <DsfrButton
                label="Précédent"
                secondary
                @click="handlePrevious"
              />
            </div>
          </div>
          <div
            v-else
            class="fr-py-5w fr-text--center"
          >
            <p>{{ isLoading ? 'Chargement du formulaire...' : 'Erreur lors du chargement du formulaire' }}</p>
          </div>
        </div>
      </div>
    </SectionContainer>
  </BrandBackgroundContainer>
</template>

<style scoped lang="scss">
.title-container {
  display: flex;
  align-items: center;
}

.simulator-form-container {
  background-color: white;
  padding: 2rem;
  border-radius: 4px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}
</style>
