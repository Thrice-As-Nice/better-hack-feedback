// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],
  vite: {
    server: {
      allowedHosts: ['tgminiappauth.share.zrok.io'],
    },
  },
  components: {
    global: true,
    dirs: ['~/components']
  }
})
