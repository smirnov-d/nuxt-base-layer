export default defineNuxtRouteMiddleware(async (to) => {
  const config = useRuntimeConfig()
  if (config.public.auth?.prefetchUser) {
    const { currentUser, fetchCurrentUser } = useAuth();

    if (!to.meta?.public && !currentUser.value) {
      await fetchCurrentUser();
    }
  }
})
