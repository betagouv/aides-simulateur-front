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
    <BrandBackgroundContainer>
      <BreadcrumbSectionContainer />
      <SectionContainer type="page-header">
        <article>
          <header class="fr-mb-4w">
            <h1>{{ post.titre }}</h1>
          </header>
          <ContentRenderer :value="post" />
        </article>
      </SectionContainer>
    </BrandBackgroundContainer>
  </template>
</template>
