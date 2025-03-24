<script setup>
const slug = useRoute().params.slug
const { data: post } = await useAsyncData(`content-${slug}`, () => {
  return queryCollection('pages').where('stem', '=', `pages/${slug}`).first()
})

// Set breadcrumbs
const { setBreadcrumbs } = useBreadcrumbStore()
setBreadcrumbs([
  { text: 'Accueil', to: '/' },
  { text: post.value?.titre || slug, to: `/content/${slug}` }
])

useSeoMeta({
  title: `${post.value?.titre} | Aides simplifiées`,
  description: post.value?.description
    ? `${post.value.description.slice(0, 155)}...`
    : `Informations sur ${post.value?.titre || slug}`
})
</script>

<template>
  <template v-if="!post">
    <div>Contenu introuvable</div>
  </template>
  <template v-else>
    <BrandBackgroundContainer
      textured
      subtle
    >
      <BreadcrumbSectionContainer />
      <SectionContainer type="page-header">
        <article>
          <header class="fr-mb-4w">
            <h1>{{ post.titre }}</h1>
          </header>
          <ContentRenderer
            :value="post"
          />
        </article>
      </SectionContainer>
    </BrandBackgroundContainer>
  </template>
</template>

<style scoped lang="scss">
:deep(th) {
  text-align: left !important;
}

:deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1.5rem;
}

:deep(thead) {
  border-bottom: 2px solid var(--border-default-grey);
}

:deep(tbody tr) {
  border-bottom: 1px solid var(--border-default-grey);

  &:last-child {
    border-bottom: none;
  }
}

:deep(th), :deep(td) {
  padding: 0.75rem;
  border-bottom: 1px solid var(--border-default-grey);
}

/* Adjustments for dark mode, if your app supports it */
.dark-mode :deep(thead),
.dark-mode :deep(th),
.dark-mode :deep(td),
.dark-mode :deep(tbody tr) {
  border-color: var(--border-default-grey-dark, #666);
}
</style>
