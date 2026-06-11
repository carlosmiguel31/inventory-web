import type { ID, Timestamps } from "@/types/common";

export type StockMovementType = "IN" | "OUT" | "ADJUSTMENT";

/** Movimentação de estoque (entrada / saída / ajuste). */
export interface StockMovement extends Timestamps {
  id: ID;
  productId: ID;
  type: StockMovementType;
  quantity: number;
  reason?: string | null;
  userId?: ID | null;
}

export type CreateStockMovementDTO = Pick<
  StockMovement,
  "productId" | "type" | "quantity" | "reason"
>;
