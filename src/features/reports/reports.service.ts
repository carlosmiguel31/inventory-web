import { productsService } from "@/features/products";
import { usersService } from "@/features/users";
import type { Paginated } from "@/types/common";
import type {
  LowStockFilter,
  LowStockItem,
  ReportsSummary,
} from "./reports.types";

/**
 * Sem endpoint dedicado de relatórios no backend. Os indicadores são DERIVADOS
 * de endpoints reais já existentes (sem inventar rotas):
 *  - produtos (total / ativos / inativos) via meta.total de /api/products
 *  - usuários via meta.total de /api/users (exibido só se vier número)
 *  - estoque baixo a partir da lista real de produtos (quantity <= minQuantity)
 *
 * Categorias/Fornecedores foram removidos temporariamente dos indicadores por
 * não retornarem um total confiável. TODO(backend): reintroduzir quando houver
 * total consistente (ou um endpoint agregado /api/reports/*).
 */
const PAGE_SIZE = 100;
const MAX_PAGES = 20; // teto: até ~2000 produtos avaliados no cliente

function baseFor(filter: LowStockFilter): Record<string, unknown> {
  if (filter === "active") return { active: true };
  if (filter === "inactive") return { active: false };
  return {};
}

async function fetchProducts(base: Record<string, unknown>) {
  const first = await productsService.list({ page: 1, pageSize: PAGE_SIZE, ...base });
  const products = [...first.data];
  const totalPages = Math.min(first.meta?.totalPages ?? 1, MAX_PAGES);
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
  getSummary: async (): Promise<ReportsSummary> => {
    const results = await Promise.allSettled([
      productsService.list({ page: 1, pageSize: 1 }),
      productsService.list({ page: 1, pageSize: 1, active: true }),
      productsService.list({ page: 1, pageSize: 1, active: false }),
      usersService.list({ page: 1, pageSize: 1 }),
    ]);

    const totalOf = (i: number): number | null => {
      const r = results[i] as PromiseSettledResult<Paginated<unknown>>;
      if (r.status !== "fulfilled") return null;
      const total = r.value?.meta?.total;
      return typeof total === "number" ? total : null;
    };

    return {
      totalProducts: totalOf(0),
      activeProducts: totalOf(1),
      inactiveProducts: totalOf(2),
      totalUsers: totalOf(3),
    };
  },

  getLowStock: async (filter: LowStockFilter): Promise<LowStockItem[]> => {
    const products = await fetchProducts(baseFor(filter));
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
