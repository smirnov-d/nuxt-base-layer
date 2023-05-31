import { useAuth } from '../composables/useAuth';

export default defineNuxtRouteMiddleware(async () => {
  const config = useRuntimeConfig()
  if (config.public.auth?.prefetchUser) {
    const { getToken, currentUser, fetchCurrentUser } = useAuth();

    if (getToken() && !currentUser.value) {
      await fetchCurrentUser();
    }
  }
})
