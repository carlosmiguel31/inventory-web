import { api } from "@/lib/axios";
import type { ListParams, Paginated } from "@/types/common";
import type {
  Category,
  CreateCategoryDTO,
  UpdateCategoryDTO,
} from "./categories.types";

/**
 * Rotas de categorias usadas pelo frontend hoje:
 *   GET    /api/categories        (page, limit, active)
 *   GET    /api/categories/:id
 *   POST   /api/categories
 *   PATCH  /api/categories/:id     (edição de nome/código)
 *   DELETE /api/categories/:id
 *
 * NÃO existe rota de inativação/reativação no backend (ver TODO abaixo).
 */
const RESOURCE = "/api/categories";

interface CategoryApiModel {
  id: string;
  name: string;
  code?: string | null;
  active?: boolean;
  createdAt: string;
  updatedAt: string;
}

function fromApi(c: CategoryApiModel): Category {
  return {
    id: c.id,
    name: c.name,
    code: c.code ?? null,
    active: c.active ?? true,
    createdAt: c.createdAt,
    updatedAt: c.updatedAt,
  };
}

function toApi(input: Partial<CreateCategoryDTO>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  if (input.name !== undefined) out.name = input.name;
  if (input.code) out.code = input.code; // omite quando vazio
  if (input.active !== undefined) out.active = input.active;
  return out;
}

function toApiQuery(params?: ListParams): Record<string, unknown> {
  const query: Record<string, unknown> = {};
  if (!params) return query;
  if (params.page !== undefined) query.page = params.page;
  if (params.pageSize !== undefined) query.limit = params.pageSize;
  if (params.active !== undefined) query.active = params.active;
  return query;
}

export const categoriesService = {
  list: async (params?: ListParams): Promise<Paginated<Category>> => {
    const { data } = await api.get<Paginated<CategoryApiModel>>(RESOURCE, {
      params: toApiQuery(params),
    });
    return { ...data, data: data.data.map(fromApi) };
  },

  getById: async (id: string | number): Promise<Category> => {
    const { data } = await api.get<CategoryApiModel>(`${RESOURCE}/${id}`);
    return fromApi(data);
  },

  create: async (payload: CreateCategoryDTO): Promise<Category> => {
    const { data } = await api.post<CategoryApiModel>(RESOURCE, toApi(payload));
    return fromApi(data);
  },

  update: async (
    id: string | number,
    payload: UpdateCategoryDTO,
  ): Promise<Category> => {
    const { data } = await api.patch<CategoryApiModel>(
      `${RESOURCE}/${id}`,
      toApi(payload),
    );
    return fromApi(data);
  },

  // TODO(backend): não existe endpoint de inativação/reativação de categorias.
  // Os testes reais retornam { "status": "error", "message": "Rota não encontrada" }
  // para PATCH /api/categories/:id, PATCH /api/categories/:id/deactivate e
  // PATCH /api/categories/:id/activate. Quando o backend expuser a rota correta,
  // adicionar aqui (ex.: deactivate/activate) e reativar a UI correspondente.

  remove: async (id: string | number): Promise<void> => {
    await api.delete(`${RESOURCE}/${id}`);
  },
};
