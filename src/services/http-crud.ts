import { api } from "@/lib/axios";
import type { ListParams, Paginated } from "@/types/common";

/**
 * Fábrica de serviço CRUD tipado sobre a instância central do Axios.
 * Os módulos de negócio criam seus serviços a partir dela e adicionam
 * endpoints específicos quando necessário.
 *
 * Convenção de rota: /api/<resource>  (ex.: /api/products, /api/products/:id)
 */
export function createCrudService<
  TEntity,
  TCreate = Partial<TEntity>,
  TUpdate = Partial<TEntity>,
>(resource: string) {
  const base = `/api/${resource}`;

  return {
    list: async (params?: ListParams): Promise<Paginated<TEntity>> => {
      const { data } = await api.get<Paginated<TEntity>>(base, { params });
      return data;
    },
    getById: async (id: string | number): Promise<TEntity> => {
      const { data } = await api.get<TEntity>(`${base}/${id}`);
      return data;
    },
    create: async (payload: TCreate): Promise<TEntity> => {
      const { data } = await api.post<TEntity>(base, payload);
      return data;
    },
    update: async (id: string | number, payload: TUpdate): Promise<TEntity> => {
      const { data } = await api.put<TEntity>(`${base}/${id}`, payload);
      return data;
    },
    remove: async (id: string | number): Promise<void> => {
      await api.delete(`${base}/${id}`);
    },
  };
}
