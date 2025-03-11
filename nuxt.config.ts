import { defineNuxtConfig } from 'nuxt/config'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({

  runtimeConfig: {
    public: {
      // apiEndpointOpenFiscaFranceCalculate: 'http://127.0.0.1:5000/calculate',
      apiEndpointOpenFiscaFranceCalculate: 'https://aides-calculatrice-back.osc-fr1.scalingo.io/calculate',
      matomo: {
        host: 'https://stats.beta.gouv.fr/',
        siteId: 199,
      },
    },
  },

  sourcemap: {
    server: true,
    client: true
  },

  vite: {
    build: {
      sourcemap: true,
    },
    css: {
      devSourcemap: true
    }
  },

  app: {
    head: {
      htmlAttrs: {
        lang: 'fr',
      },
      meta: [
        {
          name: 'format-detection',
          content: 'telephone=no',
        },
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1, shrink-to-fit=no',
        },
        {
          name: 'theme-color',
          content: '#000091',
        },
        {
          name: 'robots',
          content: 'noindex, nofollow',
        },
      ],
    },
  },

  devtools: { enabled: true },
  ssr: true,
  srcDir: 'client/',
  serverDir: 'server/',

  modules: [
    'vue-dsfr-nuxt-module',
    '@nuxt/content',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
  ],

  css: [
    '@gouvfr/dsfr/dist/core/core.main.min.css',
    '@gouvfr/dsfr/dist/component/component.main.min.css',
    '@gouvfr/dsfr/dist/utility/utility.main.min.css',

    '@gouvfr/dsfr/dist/scheme/scheme.min.css',

    '@gouvminint/vue-dsfr/styles',
    '@/styles/main.scss',
  ],

  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],

  imports: {
    dirs: [
      'composables/**',
      'stores/**',
      'utils/**',
    ],
  },

  ignore: [
    '**/*.test.*',
    '**/*.spec.*',
    '**/*.cy.*',
  ],

  compatibilityDate: '2024-09-05',
})
