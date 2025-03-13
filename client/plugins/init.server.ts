export default defineNuxtPlugin(async (nuxtApp) => {
  const aides = ((await queryCollectionNavigation('aides'))?.[0]?.children || [])
    .map(aide => aide.stem?.split('/').pop())
    ?.filter(Boolean) || []

  const simulateurs = ((await queryCollectionNavigation('simulateurs'))?.[0]?.children || [])
    .map(simulateur => simulateur.stem?.split('/').pop())
    ?.filter(Boolean) || []

  const notions = ((await queryCollectionNavigation('notions'))?.[0]?.children || [])
    .map(notion => notion.stem?.split('/').pop())
    ?.filter(Boolean) || []

  nuxtApp.payload.data = {
    ...nuxtApp.payload.data,
    validRoutes: {
      aide_id: aides,
      simulateur_id: simulateurs,
      notion_id: notions,
    },
  }
})
