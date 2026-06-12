import { api } from "@/lib/axios";
import type { Paginated } from "@/types/common";
import type {
  CreateStockMovementInput,
  StockMovement,
  StockMovementFilters,
  StockMovementProductRef,
  StockMovementUserRef,
} from "./stock.types";

/**
 * Camada de tradução entre o domínio do frontend e o contrato do backend.
 * Endpoints assumidos:
 *   GET  /api/stock/movements  (filtros: productId, type, userId, startDate, endDate, page, limit)
 *   POST /api/stock/movements
 * Ajuste os nomes em toApiQuery/toApiCreate caso o backend difira.
 */
const RESOURCE = "/api/stock/movements";

interface MovementApiModel {
  id: string;
  productId: string;
  product?: StockMovementProductRef | null;
  type: StockMovement["type"];
  quantity?: number | null;
  newQuantity?: number | null;
  receivedBy?: string | null;
  observation?: string | null;
  userId?: string | null;
  user?: StockMovementUserRef | null;
  createdAt: string;
}

function fromApi(m: MovementApiModel): StockMovement {
  return {
    id: m.id,
    productId: m.productId,
    product: m.product ?? null,
    type: m.type,
    quantity: m.quantity ?? null,
    newQuantity: m.newQuantity ?? null,
    counterpart: m.receivedBy ?? null,
    note: m.observation ?? null,
    userId: m.userId ?? null,
    user: m.user ?? null,
    createdAt: m.createdAt,
  };
}

function toApiQuery(filters?: StockMovementFilters): Record<string, unknown> {
  const query: Record<string, unknown> = {};
  if (!filters) return query;
  if (filters.page !== undefined) query.page = filters.page;
  if (filters.pageSize !== undefined) query.limit = filters.pageSize;
  if (filters.productId) query.productId = filters.productId;
  if (filters.type) query.type = filters.type;
  if (filters.userId) query.userId = filters.userId;
  if (filters.startDate) query.startDate = filters.startDate;
  if (filters.endDate) query.endDate = filters.endDate;
  return query;
}

function toApiCreate(input: CreateStockMovementInput): Record<string, unknown> {
  const body: Record<string, unknown> = {
    productId: input.productId,
    type: input.type,
    // Backend exige receivedBy ("quem recebeu / devolveu / retirou").
    receivedBy: input.counterpart ?? "",
  };
  // ADJUSTMENT usa newQuantity; os demais tipos usam quantity.
  if (input.type === "ADJUSTMENT") {
    body.newQuantity = input.newQuantity;
  } else {
    body.quantity = input.quantity;
  }
  if (input.note) body.observation = input.note;
  return body;
}

export const stockService = {
  listMovements: async (
    filters?: StockMovementFilters,
  ): Promise<Paginated<StockMovement>> => {
    const { data } = await api.get<Paginated<MovementApiModel>>(RESOURCE, {
      params: toApiQuery(filters),
    });
    return { ...data, data: data.data.map(fromApi) };
  },

  createMovement: async (
    input: CreateStockMovementInput,
  ): Promise<StockMovement> => {
    const { data } = await api.post<MovementApiModel>(
      RESOURCE,
      toApiCreate(input),
    );
    return fromApi(data);
  },
};
