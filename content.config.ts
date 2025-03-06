import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    pages: defineCollection({
      type: 'page',
      source: 'pages/**/*.md'
    }),
    simulateurs: defineCollection({
      type: 'page',
      source: 'simulateurs/**/*.md',
      schema: z.object({
        titre: z.string(),
        titreCourt: z.string(),
        pictogramme: z.string(),
      }),
    }),
    notions: defineCollection({
      type: 'page',
      source: 'notions/**/*.md',
      schema: z.object({
        titre: z.string(),
      }),
    }),
    aides: defineCollection({
      type: 'page',
      source: 'aides/**/*.md',
      schema: z.object({
        titre: z.string(),
        resume: z.string(),
        montant: z.number().nullable(),
        type: z.enum([
          'pret',
          'garantie',
          'caution',
          'periode',
          'une-fois',
          'reduction-impots',
          'aide-materielle',
          'financements',
        ]),
      })
    }),
  }
})
