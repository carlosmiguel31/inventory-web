import { api } from "@/lib/axios";
import type { ListParams, Paginated } from "@/types/common";
import type {
  CreateSupplierDTO,
  Supplier,
  UpdateSupplierDTO,
} from "./suppliers.types";

/**
 * IMPORTANTE: o backend não está disponível neste projeto, então estas rotas
 * seguem a convenção CONFIRMADA no módulo de Produtos (GET/POST/PATCH em
 * /api/<recurso>). Verifique no Swagger e ajuste AQUI (ponto único) se divergir:
 *   GET   /api/suppliers        (page, limit, name)
 *   GET   /api/suppliers/:id
 *   POST  /api/suppliers
 *   PATCH /api/suppliers/:id    (edição)
 *
 * TODO(backend): NÃO há endpoint confirmado de inativação/exclusão de
 * fornecedores. Enquanto não existir, a UI não expõe ação destrutiva.
 */
const RESOURCE = "/api/suppliers";

interface SupplierApiModel {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  document?: string | null;
  address?: string | null;
  active?: boolean;
  createdAt: string;
  updatedAt: string;
}

function fromApi(s: SupplierApiModel): Supplier {
  return {
    id: s.id,
    name: s.name,
    email: s.email ?? null,
    phone: s.phone ?? null,
    document: s.document ?? null,
    address: s.address ?? null,
    active: s.active ?? true,
    createdAt: s.createdAt,
    updatedAt: s.updatedAt,
  };
}

function toApi(input: Partial<CreateSupplierDTO>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  if (input.name !== undefined) out.name = input.name;
  if (input.email) out.email = input.email;
  if (input.phone) out.phone = input.phone;
  if (input.document) out.document = input.document;
  if (input.address) out.address = input.address;
  return out;
}

function toApiQuery(params?: ListParams): Record<string, unknown> {
  const query: Record<string, unknown> = {};
  if (!params) return query;
  if (params.page !== undefined) query.page = params.page;
  if (params.pageSize !== undefined) query.limit = params.pageSize;
  // Busca por nome do fornecedor. O endpoint de fornecedores não filtra por
  // `name` (esse é o param do módulo de Produtos); usa o genérico `search`.
  // TODO(backend): confirmar no Swagger. Se for outro nome (q/term/filter),
  // trocar apenas esta linha.
  if (params.search) query.search = params.search;
  return query;
}

export const suppliersService = {
  list: async (params?: ListParams): Promise<Paginated<Supplier>> => {
    const { data } = await api.get<Paginated<SupplierApiModel>>(RESOURCE, {
      params: toApiQuery(params),
    });
    return { ...data, data: data.data.map(fromApi) };
  },

  getById: async (id: string | number): Promise<Supplier> => {
    const { data } = await api.get<SupplierApiModel>(`${RESOURCE}/${id}`);
    return fromApi(data);
  },

  create: async (payload: CreateSupplierDTO): Promise<Supplier> => {
    const { data } = await api.post<SupplierApiModel>(RESOURCE, toApi(payload));
    return fromApi(data);
  },

  update: async (
    id: string | number,
    payload: UpdateSupplierDTO,
  ): Promise<Supplier> => {
    const { data } = await api.patch<SupplierApiModel>(
      `${RESOURCE}/${id}`,
      toApi(payload),
    );
    return fromApi(data);
  },
};
