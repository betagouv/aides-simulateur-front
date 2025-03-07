<script lang="ts" setup>
import type { DsfrCardProps } from '@gouvminint/vue-dsfr'

type AidesListProps = {
  aides: RichAide[]
  itemsPerPage?: number
} & Pick<DsfrCardProps, 'horizontal' | 'size' | 'titleTag'>

const props = withDefaults(defineProps<AidesListProps>(), {
  itemsPerPage: 6
})

// const aides: RichAide[] = [
//   {
//     id: 'aide-1',
//     title: 'Aide 1',
//     type: 'pret',
//     description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec purus nec nunc.',
//     resume: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec purus nec nunc.',
//     montant: 1000,
//   },
//   {
//     id: 'aide-2',
//     title: 'Aide 2',
//     type: 'une-fois',
//     description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec purus nec nunc.',
//     resume: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec purus nec nunc.',
//     montant: 1000,
//   },
//   {
//     id: 'aide-3',
//     title: 'Aide 3',
//     type: 'periode',
//     description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec purus nec nunc.',
//     resume: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec purus nec nunc.',
//     montant: 1000,
//   },
//   {
//     id: 'aide-4',
//     title: 'Aide 4',
//     type: 'pret',
//     description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec purus nec nunc.',
//     resume: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec purus nec nunc.',
//     montant: 1000,
//   },
//   {
//     id: 'aide-5',
//     title: 'Aide 5',
//     type: 'une-fois',
//     description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec purus nec nunc.',
//     resume: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec purus nec nunc.',
//     montant: 1000,
//   },
//   {
//     id: 'aide-6',
//     title: 'Aide 6',
//     type: 'periode',
//     description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec purus nec nunc.',
//     resume: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec purus nec nunc.',
//     montant: 1000,
//   },
//   {
//     id: 'aide-7',
//     title: 'Aide 7',
//     type: 'pret',
//     description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec purus nec nunc.',
//     resume: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec purus nec nunc.',
//     montant: 1000,
//   },
//   {
//     id: 'aide-8',
//     title: 'Aide 8',
//     type: 'une-fois',
//     description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec purus nec nunc.',
//     resume: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec purus nec nunc.',
//     montant: 1000,
//   },
//   {
//     id: 'aide-9',
//     title: 'Aide 9',
//     type: 'periode',
//     description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec purus nec nunc.',
//     resume: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec purus nec nunc.',
//     montant: 1000,
//   }
// ]

const currentPageIndex = ref<number>(0)

const totalPages = computed(() => Math.ceil(props.aides.length / props.itemsPerPage))

interface Page {
  label: string
  title: string
  href: string
}
const pages = computed<Page[]>(() =>
  Array.from({ length: totalPages.value }, (_, i) => ({
    label: String(i + 1),
    title: `Page ${i + 1}`,
    href: `#page-${i + 1}`
  }))
)

const currentPageAides = computed(() => {
  const start = currentPageIndex.value * props.itemsPerPage
  const end = start + props.itemsPerPage
  return props.aides.slice(start, end)
})
</script>

<template>
  <div class="fr-grid-row fr-grid-row--gutters">
    <div
      v-for="aide in currentPageAides"
      :key="aide.id"
      class="fr-col-12 fr-col-md-6"
    >
      <AideCard
        :link="aide.link"
        :title="aide.title"
        :description="aide.resume"
        :instructeur="aide.instructeur"
        :type-aide="aide.type"
        :montant="aide.montant"
        v-bind="{
          horizontal,
          size,
          titleTag,
        }"
      />
    </div>
  </div>

  <div
    v-if="totalPages > 1"
    class="fr-mt-4w fr-grid-row fr-grid-row--center"
  >
    <DsfrPagination
      v-model:current-page="currentPageIndex"
      :pages="pages"
    />
  </div>
</template>
