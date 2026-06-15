import { api } from "@/lib/axios";
import type { ListParams, Paginated } from "@/types/common";
import type { CreateUserDTO, UpdateUserDTO, User } from "./users.types";

/**
 * Backend não disponível neste projeto: rotas seguem a convenção CONFIRMADA no
 * módulo de Produtos (GET/POST/PATCH em /api/<recurso>). Ajuste AQUI se divergir:
 *   GET   /api/users        (page, limit, search)
 *   GET   /api/users/:id
 *   POST  /api/users        (name, email, password, role)
 *   PATCH /api/users/:id    (edição: name, email, role, active)
 *
 * Inativação NÃO usa endpoint próprio: reutiliza PATCH /api/users/:id com
 * { active: false } (a edição já contempla "Status"). Reativação idem.
 */
const RESOURCE = "/api/users";

interface UserApiModel {
  id: string;
  name: string;
  email: string;
  role?: string | null;
  active?: boolean;
  createdAt: string;
  updatedAt: string;
}

function fromApi(u: UserApiModel): User {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role ?? "",
    active: u.active ?? true,
    createdAt: u.createdAt,
    updatedAt: u.updatedAt,
  };
}

function toApiUpdate(dto: UpdateUserDTO): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  if (dto.name !== undefined) out.name = dto.name;
  if (dto.email !== undefined) out.email = dto.email;
  if (dto.role !== undefined) out.role = dto.role;
  if (dto.active !== undefined) out.active = dto.active;
  return out;
}

function toApiQuery(params?: ListParams): Record<string, unknown> {
  const query: Record<string, unknown> = {};
  if (!params) return query;
  if (params.page !== undefined) query.page = params.page;
  if (params.pageSize !== undefined) query.limit = params.pageSize;
  // TODO(backend): confirmar o parâmetro de busca (assumido: search).
  if (params.search) query.search = params.search;
  return query;
}

export const usersService = {
  list: async (params?: ListParams): Promise<Paginated<User>> => {
    const { data } = await api.get<Paginated<UserApiModel>>(RESOURCE, {
      params: toApiQuery(params),
    });
    return { ...data, data: data.data.map(fromApi) };
  },

  getById: async (id: string | number): Promise<User> => {
    const { data } = await api.get<UserApiModel>(`${RESOURCE}/${id}`);
    return fromApi(data);
  },

  create: async (payload: CreateUserDTO): Promise<User> => {
    const { data } = await api.post<UserApiModel>(RESOURCE, {
      name: payload.name,
      email: payload.email,
      password: payload.password,
      role: payload.role,
    });
    return fromApi(data);
  },

  update: async (
    id: string | number,
    payload: UpdateUserDTO,
  ): Promise<User> => {
    const { data } = await api.patch<UserApiModel>(
      `${RESOURCE}/${id}`,
      toApiUpdate(payload),
    );
    return fromApi(data);
  },
};
