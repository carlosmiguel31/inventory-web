import { api } from "@/lib/axios";
import type { ListParams, Paginated } from "@/types/common";
import type {
  CreateProductDTO,
  Product,
  UpdateProductDTO,
} from "./products.types";

/**
 * Camada de tradução (anti-corruption layer) entre o domínio do frontend e o
 * contrato do backend. O frontend usa `price` / `quantity` / `minQuantity`;
 * o backend usa `value` / `currentStock` / `minStock`. Todo o mapeamento fica
 * centralizado aqui — o formulário, a tabela e os tipos permanecem inalterados.
 */
const RESOURCE = "/api/products";

/** Forma do produto como o backend devolve/recebe. */
interface ProductApiModel {
  id: string;
  sku: string;
  name: string;
  description?: string | null;
  value: number;
  cost?: number | null;
  currentStock: number;
  minStock: number;
  categoryId?: string | null;
  supplierId?: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

/** Backend -> domínio do frontend. */
function fromApi(p: ProductApiModel): Product {
  return {
    id: p.id,
    sku: p.sku,
    name: p.name,
    description: p.description ?? null,
    price: p.value ?? 0,
    cost: p.cost ?? null,
    quantity: p.currentStock ?? 0,
    minQuantity: p.minStock ?? 0,
    categoryId: p.categoryId ?? null,
    supplierId: p.supplierId ?? null,
    active: p.active,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  };
}

/**
 * Domínio do frontend -> backend.
 * Renomeia price->value, quantity->currentStock, minQuantity->minStock e só
 * inclui as chaves presentes (funciona tanto para create quanto para update).
 */
function toApi(input: Partial<CreateProductDTO>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  if (input.name !== undefined) out.name = input.name;
  if (input.sku !== undefined) out.sku = input.sku;
  // Descrição é opcional: só envia quando há texto (omite vazio/null/undefined).
  if (input.description) out.description = input.description;
  if (input.price !== undefined) out.value = input.price;
  if (input.cost !== undefined && input.cost !== null) out.cost = input.cost;
  if (input.quantity !== undefined) out.currentStock = input.quantity;
  if (input.minQuantity !== undefined) out.minStock = input.minQuantity;
  if (input.categoryId !== undefined) out.categoryId = input.categoryId;
  if (input.supplierId !== undefined) out.supplierId = input.supplierId;
  if (input.active !== undefined) out.active = input.active;
  return out;
}

/**
 * Mapeia os parâmetros de listagem do frontend para o contrato do backend.
 * Backend aceita: name, sku, categoryId, active, page, limit.
 * - pageSize  -> limit
 * - search    -> name + sku (busca única por nome OU SKU)
 * - page / categoryId / active mantêm o mesmo nome.
 * Somente parâmetros definidos são enviados.
 */
function toApiQuery(params?: ListParams): Record<string, unknown> {
  const query: Record<string, unknown> = {};
  if (!params) return query;
  if (params.page !== undefined) query.page = params.page;
  if (params.pageSize !== undefined) query.limit = params.pageSize;
  if (params.categoryId !== undefined) query.categoryId = params.categoryId;
  if (params.active !== undefined) query.active = params.active;
  // Busca única "nome ou SKU": enviamos APENAS um parâmetro por vez. Enviar
  // name e sku juntos fazia o backend usar só o name (a busca por SKU não
  // funcionava). Termo sem espaço contendo dígito ou hífen é tratado como SKU;
  // os demais, como nome. Isso funciona com backend AND, OR ou por prioridade.
  if (params.search) {
    const term = String(params.search).trim();
    if (term) {
      const looksLikeSku = !/\s/.test(term) && /[\d-]/.test(term);
      if (looksLikeSku) query.sku = term;
      else query.name = term;
    }
  }
  return query;
}

export const productsService = {
  list: async (params?: ListParams): Promise<Paginated<Product>> => {
    const { data } = await api.get<Paginated<ProductApiModel>>(RESOURCE, {
      params: toApiQuery(params),
    });
    return { ...data, data: data.data.map(fromApi) };
  },

  getById: async (id: string | number): Promise<Product> => {
    const { data } = await api.get<ProductApiModel>(`${RESOURCE}/${id}`);
    return fromApi(data);
  },

  create: async (payload: CreateProductDTO): Promise<Product> => {
    const { data } = await api.post<ProductApiModel>(RESOURCE, toApi(payload));
    return fromApi(data);
  },

  update: async (
    id: string | number,
    payload: UpdateProductDTO,
  ): Promise<Product> => {
    const { data } = await api.patch<ProductApiModel>(
      `${RESOURCE}/${id}`,
      toApi(payload),
    );
    return fromApi(data);
  },

  remove: async (id: string | number): Promise<void> => {
    await api.delete(`${RESOURCE}/${id}`);
  },
};
