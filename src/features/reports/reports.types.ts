import type { ID } from "@/types/common";

/**
 * Resumo derivado das listagens reais (cada número vem do meta.total do
 * respectivo endpoint). `null` = aquele dado não pôde ser obtido da API.
 */
export interface ReportsSummary {
  totalProducts: number | null;
  activeProducts: number | null;
  inactiveProducts: number | null;
  totalCategories: number | null;
  totalSuppliers: number | null;
  totalUsers: number | null;
}

export interface LowStockItem {
  id: ID;
  name: string;
  sku: string;
  quantity: number; // estoque atual
  minQuantity: number; // estoque mínimo
}
