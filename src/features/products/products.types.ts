import type { ID, Timestamps } from "@/types/common";

/**
 * Produto. Campos inferidos de um modelo típico de estoque (Prisma/Postgres).
 * Ajuste conforme o schema real do backend.
 */
export interface Product extends Timestamps {
  id: ID;
  sku: string;
  name: string;
  description?: string | null;
  price: number;
  cost?: number | null;
  quantity: number;
  minQuantity: number;
  categoryId?: ID | null;
  supplierId?: ID | null;
  active: boolean;
}

export type CreateProductDTO = Omit<Product, "id" | "createdAt" | "updatedAt">;
export type UpdateProductDTO = Partial<CreateProductDTO>;
