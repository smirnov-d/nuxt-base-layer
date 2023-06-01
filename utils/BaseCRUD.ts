export interface IFilter {
  [key: string]: string | number | boolean;
}

export class BaseCRUD<T> {
  constructor(
    protected readonly path: string,
    protected readonly http = useCustomFetch
  ) {}

  // todo: add pagination, sorting, filtering
  public async getAll(filter: IFilter, options = {}) {
    return this.http(this.path, { default: () => ([]), ...options });
  }

  // get a single entity
  public async get(id: number, options = {}) {
    return this.http<T>(`${this.path}/${id}`, { default: null, ...options });
  }

  // create a new entity
  public async create(entity: T, options = {}) {
    return this.http<T>(`${this.path}`, {
      method: 'POST',
      body: entity,
      default: null,
      ...options,
    });
  }

  // update an existing entity
  public async update(entity: T, options = {}) {
    return this.http<T>(`${this.path}/${entity.id}`, {
      method: 'PUT',
      body: entity,
      default: null,
      ...options,
    })
  }

  // delete an existing entity
  public async delete(id: number, options = {}) {
    return this.http<T>(`${this.path}/${id}`, {
      method: 'DELETE',
      default: null,
      ...options,
    })
  }
}
