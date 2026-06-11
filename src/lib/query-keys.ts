/**
 * Query keys centralizadas para o TanStack Query.
 *
 * `entityKeys` é a fábrica que padroniza as chaves de cada recurso, garantindo
 * invalidações consistentes. Apenas PREPARAÇÃO — nenhum fetch é feito aqui.
 *
 * Exemplos de uso futuro:
 *   queryKeys.products.list({ page: 1 })  -> ["products","list",{page:1}]
 *   queryClient.invalidateQueries({ queryKey: queryKeys.products.all })
 */
function entityKeys<const S extends string>(scope: S) {
  return {
    all: [scope] as const,
    lists: () => [scope, "list"] as const,
    list: (params?: Record<string, unknown>) =>
      [scope, "list", params ?? {}] as const,
    details: () => [scope, "detail"] as const,
    detail: (id: string | number) => [scope, "detail", id] as const,
  };
}

export const queryKeys = {
  auth: {
    me: () => ["auth", "me"] as const,
  },
  products: entityKeys("products"),
  stock: entityKeys("stock"),
  suppliers: entityKeys("suppliers"),
  categories: entityKeys("categories"),
  users: entityKeys("users"),
  reports: {
    ...entityKeys("reports"),
    summary: () => ["reports", "summary"] as const,
    overview: () => ["reports", "overview"] as const,
  },
} as const;
