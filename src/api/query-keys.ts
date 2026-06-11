/**
 * Fábrica central de query keys para o TanStack Query.
 *
 * Apenas PREPARAÇÃO para o consumo futuro das rotas — nenhuma lógica de fetch
 * é implementada aqui ainda. Centralizar as chaves agora evita strings soltas
 * e facilita invalidações consistentes quando os CRUDs forem criados.
 */
export const queryKeys = {
  products: {
    all: ["products"] as const,
    list: (params?: Record<string, unknown>) =>
      ["products", "list", params ?? {}] as const,
    detail: (id: string) => ["products", "detail", id] as const,
  },
  stock: {
    all: ["stock"] as const,
    list: (params?: Record<string, unknown>) =>
      ["stock", "list", params ?? {}] as const,
  },
  categories: {
    all: ["categories"] as const,
    list: () => ["categories", "list"] as const,
  },
  suppliers: {
    all: ["suppliers"] as const,
    list: (params?: Record<string, unknown>) =>
      ["suppliers", "list", params ?? {}] as const,
    detail: (id: string) => ["suppliers", "detail", id] as const,
  },
  reports: {
    all: ["reports"] as const,
  },
} as const;
