import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    pages: defineCollection({
      type: 'page',
      source: 'pages/**/*.md',
      schema: z.object({
        titre: z.string(),
      }),
    }),
    simulateurs: defineCollection({
      type: 'page',
      source: 'simulateurs/**/*.md',
      schema: z.object({
        titre: z.string(),
        status: z.enum(['published', 'draft', 'unlisted']),
        titreCourt: z.string(),
        description: z.string(),
        pictogramme: z.string(),
      }),
    }),
    notions: defineCollection({
      type: 'page',
      source: 'notions/**/*.md',
      schema: z.object({
        titre: z.string(),
        description: z.string(),
      }),
    }),
    aides: defineCollection({
      type: 'page',
      source: 'aides/**/*.md',
      schema: z.object({
        titre: z.string(),
        description: z.string(),
        instructeur: z.string(),
        montant: z.number().nullable(),
        textesLoi: z.array(
          z.union([
            z.string().nullable(),
            z.object({
              prefixe: z.string(),
              label: z.string(),
              url: z.string(),
            }).nullable(),
          ]),
        ),
        usage: z.enum([
          'loyer-logement',
          'frais-installation-logement',
          'caution-logement',
          'pret-garantie-logement',
        ]),
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
