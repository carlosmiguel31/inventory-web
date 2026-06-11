import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/query-keys";
import type { ListParams } from "@/types/common";
import { productsService } from "./products.service";

/** Lista de produtos (read-only). Mutations virão no módulo de CRUD. */
export function useProducts(params?: ListParams) {
  return useQuery({
    queryKey: queryKeys.products.list(params),
    queryFn: () => productsService.list(params),
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: queryKeys.products.detail(id),
    queryFn: () => productsService.getById(id),
    enabled: Boolean(id),
  });
}
