import { resolve } from 'node:path'
import { defineNuxtConfig } from 'nuxt/config'

// Use the package version for the iframe integration script
const IFRAME_SCRIPT_VERSION = '1.0.0'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: !import.meta.test },
  srcDir: 'client/',
  nitro: {
    preset: 'node-cluster'
  },
  vite: {
    server: {
      allowedHosts: ['aides.beta.numerique.gouv.fr'],
    },
    build: {
      sourcemap: true,
    },
    css: {
      devSourcemap: true
    },
  },

  hooks: {
    'build:before': async () => {
      // Build the iframe-integration script separately
      try {
        const { build } = await import('vite')
        await build({
          build: {
            lib: {
              entry: resolve(__dirname, 'client/scripts/iframe-integration.js'),
              name: 'IframeIntegration',
              fileName: () => `iframe-integration@${IFRAME_SCRIPT_VERSION}.js`,
              formats: ['umd'],
            },
            outDir: resolve(__dirname, 'client/public'),
            emptyOutDir: false,
            rollupOptions: {
              external: [],
              output: {
                inlineDynamicImports: true,
              },
            },
            minify: true,
          },
        })
        console.log(`Iframe integration script built successfully (v${IFRAME_SCRIPT_VERSION})`)
      }
      catch (error) {
        console.error('Error building iframe integration script:', error)
      }
    }
  },

  routeRules: {
    '/': { prerender: true },
    '/contact': { prerender: true },
    '/integrer-nos-simulateurs': { prerender: true },
    '/partenaires': { prerender: true },
    '/cookies': { prerender: true },
    '/content/accessibilite': { prerender: true },
    '/content/mentions-legales': { prerender: true },
    '/content/cgu': { prerender: true },
    'simulateurs/[simulateur_id]/**': {
      ssr: false,
    },
    'simulateurs/demenagement-logement': {
      prerender: true,
    },
    'notions/': {
      prerender: true,
    },
    'aides/': {
      prerender: true,
    },
    'simulateurs/': {
      prerender: true,
    },
    '/accessibilite': { // mandatory route
      redirect: {
        to: '/content/accessibilite', // content generated route
        statusCode: 308, // Redirect permanently
      },
    },
    '/iframe-integration.js': {
      redirect: {
        to: `/iframe-integration@${IFRAME_SCRIPT_VERSION}.js`,
        statusCode: 308, // Redirect permanently
      },
    },
  },

  runtimeConfig: {
    // Variables serveur privées (accessibles uniquement côté serveur)
    adminPassword: import.meta.env.ADMIN_PASSWORD || '',
    matomo: {
      url: import.meta.env.MATOMO_URL || 'https://stats.beta.gouv.fr/',
      token: import.meta.env.MATOMO_TOKEN || '',
      siteId: import.meta.env.MATOMO_SITE_ID || '199',
    },
    leximpactUrl: import.meta.env.LEXIMPACT_URL || 'https://territoires.leximpact.dev',
    apiEndpointOpenFiscaFranceCalculate: import.meta.env.OPENFISCA_URL || 'https://aides-calculatrice-back.osc-fr1.scalingo.io/calculate',

    public: {
      // apiEndpointOpenFiscaFranceCalculate: 'http://127.0.0.1:5000/calculate',
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

  content: {
    renderer: {
      anchorLinks: false
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

  modules: [
    'vue-dsfr-nuxt-module',
    '@nuxt/content',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
    '@nuxt/test-utils/module',
    'nuxt-security'
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
