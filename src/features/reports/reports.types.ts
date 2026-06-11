import type { ID } from "@/types/common";

export interface InventorySummary {
  totalProducts: number;
  totalStockValue: number;
  lowStockCount: number;
  activeSkus: number;
}

export interface LowStockItem {
  productId: ID;
  sku: string;
  name: string;
  quantity: number;
  minQuantity: number;
}

export interface MovementSeriesPoint {
  date: string;
  in: number;
  out: number;
}

/** Visão consolidada usada na tela de relatórios. */
export interface Report {
  summary: InventorySummary;
  lowStock: LowStockItem[];
  movements: MovementSeriesPoint[];
}
