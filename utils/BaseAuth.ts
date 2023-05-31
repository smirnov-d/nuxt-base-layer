import { useCustomFetch } from '../composables/useCustomFetch';

export class BaseAuth<T> {
  constructor(protected readonly path = '', protected readonly http = useCustomFetch) {}

  public async me() {
    const config = useRuntimeConfig();
    return this.http<T>(this.path + config.public.auth.api.me);
  }

  public async login(login: string, password: string) {
    const config = useRuntimeConfig();
    return this.http<string>(this.path + config.public.auth.api.login, {
      method: "POST",
      body: {
        login,
        password
      },
    });
  }

  public async refresh() {
    const config = useRuntimeConfig();
    return this.http<string>(this.path + config.public.auth.api.refresh);
  }

  public async logout() {
    const config = useRuntimeConfig();
    return this.http<unknown>(this.path + config.public.auth.api.logout, {
      method: "POST",
    });
  }
}
