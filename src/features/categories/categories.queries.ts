import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/query-keys";
import type { ListParams } from "@/types/common";
import { categoriesService } from "./categories.service";

export function useCategories(params?: ListParams) {
  return useQuery({
    queryKey: queryKeys.categories.list(params),
    queryFn: () => categoriesService.list(params),
  });
}

export function useCategory(id: string) {
  return useQuery({
    queryKey: queryKeys.categories.detail(id),
    queryFn: () => categoriesService.getById(id),
    enabled: Boolean(id),
  });
}
