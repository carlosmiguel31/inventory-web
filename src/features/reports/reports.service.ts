import { categoriesService } from "@/features/categories";
import { productsService } from "@/features/products";
import { suppliersService } from "@/features/suppliers";
import { usersService } from "@/features/users";
import type { Paginated } from "@/types/common";
import type { LowStockItem, ReportsSummary } from "./reports.types";

/**
 * NÃO há endpoint dedicado de relatórios confirmado no backend. Em vez de
 * inventar /api/reports/*, os indicadores são DERIVADOS dos endpoints de
 * listagem já existentes (lendo meta.total) e o estoque baixo é calculado a
 * partir da lista real de produtos (quantity <= minQuantity).
 *
 * TODO(backend): se existirem endpoints agregados (ex.: /api/reports/summary,
 * /api/reports/low-stock) ou exportação (CSV/XLSX/PDF), trocar as derivações
 * abaixo por chamadas diretas — é mais eficiente em bases grandes.
 */
const PAGE_SIZE = 100;
const MAX_PAGES = 20; // teto de segurança: até 2000 produtos avaliados no cliente

async function fetchProducts(activeOnly: boolean) {
  const base = activeOnly ? { active: true } : {};
  const first = await productsService.list({ page: 1, pageSize: PAGE_SIZE, ...base });
  const products = [...first.data];
  const totalPages = Math.min(first.meta.totalPages ?? 1, MAX_PAGES);
  if (totalPages > 1) {
    const rest = await Promise.all(
      Array.from({ length: totalPages - 1 }, (_, i) =>
        productsService.list({ page: i + 2, pageSize: PAGE_SIZE, ...base }),
      ),
    );
    rest.forEach((r) => products.push(...r.data));
  }
  return products;
}

export const reportsService = {
  /** Contadores via meta.total de cada listagem real. allSettled => parcial. */
  getSummary: async (): Promise<ReportsSummary> => {
    const results = await Promise.allSettled([
      productsService.list({ page: 1, pageSize: 1 }),
      productsService.list({ page: 1, pageSize: 1, active: true }),
      productsService.list({ page: 1, pageSize: 1, active: false }),
      categoriesService.list({ page: 1, pageSize: 1 }),
      suppliersService.list({ page: 1, pageSize: 1 }),
      usersService.list({ page: 1, pageSize: 1 }),
    ]);

    const totalOf = (i: number): number | null => {
      const r = results[i] as PromiseSettledResult<Paginated<unknown>>;
      if (r.status !== "fulfilled") return null;
      // Endpoint pode responder sem `meta` (ou meta sem total): nesse caso o
      // dado é considerado indisponível, sem quebrar os demais cards.
      const total = r.value?.meta?.total;
      return typeof total === "number" ? total : null;
    };

    return {
      totalProducts: totalOf(0),
      activeProducts: totalOf(1),
      inactiveProducts: totalOf(2),
      totalCategories: totalOf(3),
      totalSuppliers: totalOf(4),
      totalUsers: totalOf(5),
    };
  },

  /** Estoque baixo derivado da lista real de produtos. */
  getLowStock: async (activeOnly: boolean): Promise<LowStockItem[]> => {
    const products = await fetchProducts(activeOnly);
    return products
      .filter((p) => p.minQuantity > 0 && p.quantity <= p.minQuantity)
      .map((p) => ({
        id: p.id,
        name: p.name,
        sku: p.sku,
        quantity: p.quantity,
        minQuantity: p.minQuantity,
      }))
      .sort((a, b) => a.quantity - a.minQuantity - (b.quantity - b.minQuantity));
  },
};
