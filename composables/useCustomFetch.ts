import { useRequestCounter } from './useRequestCounter';
import { useAuth } from './useAuth';

export const useCustomFetch = async <T>(url: string, options = {}) => {
  const { increment, decrement } = useRequestCounter();
  const { logout, getToken, refreshToken } = useAuth();
  const config = useRuntimeConfig()

  const customOptions = {
    baseURL: config.public.apiBaseURL,
    ...options,
    headers: {
      'jwt-access': '',
    }
  }

  return useFetch<T>(url, {
    ...customOptions,
    async onRequest({ options }) {
      !customOptions?.lazy && increment();
      const accessToken = getToken();
      if (accessToken) {
        options.headers = { "jwt-access": accessToken, "Authorization": 'Bearer '+accessToken }
      }
    },
    async onRequestError() {
      !customOptions?.lazy && decrement();
    },
    async onResponse() {
      !customOptions?.lazy && decrement();
    },
    async onResponseError({ request, response, options }) {
      const originalConfig = options;
      if (response.status === 401 && !originalConfig?._retry) {
        originalConfig._retry = true;
        try {
          await refreshToken();
          return await useCustomFetch(request, options);
        } catch (_error) {
          await logout();
          return Promise.reject(_error);
        }
      }
      return Promise.reject(response);
    },
  })
}
