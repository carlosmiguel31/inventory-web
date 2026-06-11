import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/query-keys";
import type { ListParams } from "@/types/common";
import { suppliersService } from "./suppliers.service";

export function useSuppliers(params?: ListParams) {
  return useQuery({
    queryKey: queryKeys.suppliers.list(params),
    queryFn: () => suppliersService.list(params),
  });
}

export function useSupplier(id: string) {
  return useQuery({
    queryKey: queryKeys.suppliers.detail(id),
    queryFn: () => suppliersService.getById(id),
    enabled: Boolean(id),
  });
}
