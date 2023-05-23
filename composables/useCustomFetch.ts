import { FetchOptions } from 'unfetch';
import { useCounter } from './useCounter';

const { counter, increment, decrement } = useCounter();

export const useCustomFetch = <T>(url: string, options?: FetchOptions) => {
  const config = useRuntimeConfig()
  const customOptions = {
    baseURL: config.public.apiBaseURL,
    // todo: check cookies
    // withCredentials: true,
    ...options,
    // lazy: true,
  }

  return useFetch<T>(url, {
    ...customOptions,
    async onResponse({ request, response, options }) {
      console.log('[fetch response]', counter.value, customOptions)
      !customOptions?.lazy && decrement();
    },
    async onResponseError({ request, response, options }) {
      console.log('onResponseError', request, response, options);
      const originalConfig = options;
      if (response.status === 401 && !originalConfig?._retry) {
        originalConfig._retry = true;
        try {
          const { data } = await useCustomFetch("login", {
            method: 'POST',
            body: {
              "email": "eve.holt@reqres.in",
              "password": "cityslicka"
            },
          });
          localStorage.setItem('token', data.value?.token);
          return useCustomFetch(request, options);
        } catch (_error) {
          localStorage.removeItem('token')
          return Promise.reject(_error);
        }
      }
    },
    async onRequest({ options }) {
      console.log(counter.value);
      !customOptions?.lazy && increment();
      const accessToken = localStorage.getItem('token')
      if (accessToken) {
        options.headers = { "jwt-access": accessToken }
      }
    },
    async onRequestError({ request, options, error }) {
      console.log('[fetch request error]')
      console.log(counter.value);
      !customOptions?.lazy && decrement();
    },
  })
}
