import type { ID } from "@/types/common";

export type LowStockFilter = "all" | "active" | "inactive";

/**
 * Indicadores derivados de endpoints reais. Apenas os calculáveis de forma
 * confiável hoje: produtos (via meta.total) e usuários. `null` = indisponível
 * (o card correspondente é ocultado na UI, nunca exibido como "Indisponível").
 */
export interface ReportsSummary {
  totalProducts: number | null;
  activeProducts: number | null;
  inactiveProducts: number | null;
  totalUsers: number | null;
}

export interface LowStockItem {
  id: ID;
  name: string;
  sku: string;
  quantity: number; // estoque atual
  minQuantity: number; // estoque mínimo
}
