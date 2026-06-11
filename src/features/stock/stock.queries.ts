import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/query-keys";
import type { ListParams } from "@/types/common";
import { stockService } from "./stock.service";

/** Histórico de movimentações (read-only). */
export function useStock(params?: ListParams) {
  return useQuery({
    queryKey: queryKeys.stock.list(params),
    queryFn: () => stockService.list(params),
  });
}
