<script lang="ts" setup>
import type { DsfrCardProps } from '@gouvminint/vue-dsfr'

// export type DsfrCardProps = {
//   link?: string | RouteLocationRaw
//   title: string
//   description: string
//   size?: 'md' | 'medium' | 'large' | 'lg' | 'sm' | 'small' | undefined
//   detail?: string
//   detailIcon?: DsfrCardDetailProps['icon']
//   endDetail?: string
//   endDetailIcon?: DsfrCardDetailProps['icon']
//   altImg?: string
//   titleTag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
//   badges?: DsfrBadgeProps[]
//   buttons?: DsfrButtonProps[]
//   imgRatio?: 'md' | 'medium' | 'lg' | 'large' | 'sm' | 'small'
//   linksGroup?: {
//     label: string
//     to?: RouteLocationRaw
//     /** @deprecated utiliser href à la place, link sera supprimé dans une version future */
//     link?: string
//     href?: string
//   }[]
//   noArrow?: boolean
//   horizontal?: boolean
//   download?: boolean
//   enlarge?: boolean
// }
import type { RouteLocationRaw } from 'vue-router'

interface AideCardProps {
  title: string
  horizontal?: boolean
  titleTag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  description: string
  size?: 'md' | 'medium' | 'large' | 'lg' | 'sm' | 'small' | undefined
  link?: string | RouteLocationRaw
  typeAide?: TypeAide
  instructeur?: string
  montant?: number
}
const props = withDefaults(defineProps<AideCardProps>(), {
  titleTag: 'h3',
  size: 'md',
  horizontal: false,
})

const sm = computed(() => {
  return ['sm', 'small'].includes(props.size)
})
const lg = computed(() => {
  return ['lg', 'large'].includes(props.size)
})

const externalLink = computed(() => {
  return typeof props.link === 'string' && props.link.startsWith('http')
})

const titleEl = ref<HTMLElement | null>(null)
function goToTargetLink () {
  (titleEl.value?.querySelector('.fr-card__link') as HTMLDivElement).click()
}
defineExpose({ goToTargetLink })
</script>

<template>
  <div
    class="fr-card"
    :class="{
      'fr-card--horizontal': horizontal,
      // 'fr-enlarge-link': !noArrow,
      'fr-card--sm': sm,
      'fr-card--lg': lg,
      // 'fr-card--download': download,
      // 'fr-enlarge-button': enlarge,
    }"
    data-testid="fr-card"
  >
    <div class="fr-card__body">
      <div class="fr-card__content">
        <component
          :is="titleTag"
          class="fr-card__title"
        >
          <a
            v-if="externalLink"
            :href="(link as string)"
            data-testid="card-link"
            class="fr-card__link"
          >{{ title }}</a>
          <RouterLink
            v-else-if="link"
            :to="link"
            class="fr-card__link"
            data-testid="card-link"
            @click="$event.stopPropagation()"
          >
            {{ title }}
          </RouterLink>
          <template v-else>
            {{ title }}
          </template>
        </component>
        <p class="fr-card__desc">
          {{ description }}
        </p>
      </div>
      <div
        v-if="typeAide"
        class="fr-card__header"
      >
        <ul
          class="fr-tags-group"
        >
          <TypeAideTag
            small
            :type="typeAide"
          />
        </ul>
      </div>
      <AideMontant
        v-if="montant"
        :montant="montant"
        size="lg"
      />
    </div>
  </div>
</template>
