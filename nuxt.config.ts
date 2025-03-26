// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  runtimeConfig: {
    public: {
      apiBaseURL:
        process.env.NODE_ENV === 'production'
          ? process.env.API_BASE_URL
          : '/api',
      auth: {
        // specify api.me if enable prefetching
        prefetchUser: true,
        api: {
          login: '/login',
          logout: '/logout',
          refresh: '/refresh-access',
          me: '/me',
        },
        // Each redirect path can be disabled by setting to false
        redirect: {
          login: '/login', // User will be redirected to this path if login is required.
          logout: '/login', // User will be redirected to this path after logout, if current route is protected.
          home: '/', // User will be redirected to this path after login.
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
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
      allowedHosts: true,
    },
    build: {
      target: 'esnext',
    }
  },
})
