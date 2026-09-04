// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt'],
  css: ['@/assets/css/tailwind.css'],
  app: {
    head: {
      title: 'FutTrain',
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.png' },
        // O para PNG:
        // { rel: 'icon', type: 'image/png', href: '/favicon.png' }
      ]
    }
  }
})
