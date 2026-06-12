import type { ID } from "@/types/common";

export type StockMovementType =
  | "PURCHASE_ENTRY"
  | "RETURN_ENTRY"
  | "TECHNICIAN_OUTPUT"
  | "ADJUSTMENT"
  | "LOSS"
  | "TRANSFER";

export interface StockMovementProductRef {
  id: ID;
  name: string;
  sku: string;
}

export interface StockMovementUserRef {
  id: ID;
  name: string;
}

/**
 * Movimentação de estoque. Campos `product`/`user` são opcionais pois o backend
 * pode ou não embutir os dados relacionados — quando ausentes, a UI resolve
 * pelos mapas de produtos/usuários.
 */
export interface StockMovement {
  id: ID;
  productId: ID;
  product?: StockMovementProductRef | null;
  type: StockMovementType;
  quantity: number | null;
  newQuantity?: number | null;
  /** Quem recebeu / devolveu / retirou. */
  counterpart?: string | null;
  /** Observação. */
  note?: string | null;
  userId?: ID | null;
  user?: StockMovementUserRef | null;
  createdAt: string;
}

export interface CreateStockMovementInput {
  productId: string;
  type: StockMovementType;
  /** usado quando type !== ADJUSTMENT */
  quantity?: number;
  /** usado quando type === ADJUSTMENT */
  newQuantity?: number;
  counterpart?: string;
  note?: string;
}

export interface StockMovementFilters {
  productId?: string;
  type?: string;
  userId?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  pageSize?: number;
}
