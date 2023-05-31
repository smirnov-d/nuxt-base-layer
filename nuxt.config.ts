// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  ssr: false,
  app: {
    head: {
      title: 'Extending Configs is Fun!',
      meta: [
        { name: 'description', content: 'I am using the extends feature in nuxt 3!' }
      ],
    }
  },
  runtimeConfig: {
    public: {
      apiBaseURL: process.env.API_BASE_URL,
      // process.env.NODE_ENV === 'production'
      //   ? process.env.API_BASE_URL
      //   : '/api',
      auth: {
        // specify api.me if enable prefetching
        prefetchUser: true,
        api: {
          login: '/login',
          logout: '/logout',
          refresh: '/refresh-access',
          me: '/me',
        },
      },
    },
  },
  vite: {
    server: {
      cors: true,
      proxy: {
        '/api': {
          target: process.env.API_BASE_URL,
          changeOrigin: true,
        },
      },
    },
    define: {
      'process.env.DEBUG': false,
    },
  },
})
