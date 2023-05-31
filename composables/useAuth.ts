import { apiService } from '~/api/api.service';

const currentUser = ref<IUser | null>(null);

const token = ref<string | null>(null);

export function useAuth() {

  const isAuthenticated = computed(() => !!currentUser.value)

  function setToken(data: string | null = null) {
    token.value = data;
  }
  function getToken() {
    return token.value;
  }

  async function fetchCurrentUser() {
    const { data } = await apiService.auth.me();
    currentUser.value = data;
  }

  async function login(login: string, password: string) {
    const { data } = await apiService.auth.login(login, password);
    setToken(data.value.token);
    return await fetchCurrentUser();
  }

  async function refreshToken() {
    const { data } = await apiService.auth.refresh();
    setToken(data.value.token);
    return data.value.token;
  }

  async function logout() {
    await apiService.auth.logout();
    setToken();
    currentUser.value = null;
    window.location.reload();
  }

  return {
    setToken,
    getToken,
    currentUser,
    isAuthenticated,
    login,
    refreshToken,
    fetchCurrentUser,
    logout,
  }
}
