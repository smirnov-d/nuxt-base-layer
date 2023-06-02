export default defineNuxtRouteMiddleware(async () => {
  const config = useRuntimeConfig()
  if (config.public.auth?.prefetchUser) {
    const { getToken, currentUser, fetchCurrentUser } = useAuth();

    if (getToken() && !currentUser.value) {
      // await fetchCurrentUser();
      // await useCustomFetch('/auth/me');
      await useFetch('http://localhost:3005/api/auth/me');
    }
  }
})
