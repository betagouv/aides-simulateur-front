<script setup>
const slug = useRoute().params.slug
const { data: post } = await useAsyncData(`content-${slug}`, () => {
  return queryCollection('pages').where('stem', '=', `pages/${slug}`).first()
})
useSeoMeta({
  title: `${post.value?.titre} | Aides simplifiées`,
  description: `${post.value?.description.slice(0, 155)}...`
})
</script>

<template>
  <template v-if="!post">
    <div>Contenu introuvable</div>
  </template>
  <template v-else>
    <ContentRenderer :value="post" />
  </template>
</template>
