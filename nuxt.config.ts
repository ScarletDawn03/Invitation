export default defineNuxtConfig({
  compatibilityDate: '2026-01-01',
  modules: ['@nuxt/ui'],
  css: ['~/assets/css/main.css'],
  devtools: { enabled: false },
  ui: { fonts: false },
  colorMode: { preference: 'light', fallback: 'light' },
  app: {
    baseURL: process.env.NUXT_APP_BASE_URL || '/',
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      title: 'A little date? — An invitation for you',
      meta: [
        {
          name: 'description',
          content: 'A little invitation to spend a lovely day together.'
        },
        { name: 'robots', content: 'noindex, nofollow' }
      ]
    }
  },
  runtimeConfig: { public: { supabaseUrl: '', supabaseKey: '' } },
  nitro: {
    prerender: {
      routes: [
        '/',
        '/dates',
        '/times',
        '/itinerary',
        '/really',
        '/review',
        '/thank-you'
      ]
    }
  },
  typescript: { strict: true }
})
