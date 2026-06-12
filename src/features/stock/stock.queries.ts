import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/query-keys";
import { stockService } from "./stock.service";
import type { StockMovementFilters } from "./stock.types";

export function useStockMovements(filters?: StockMovementFilters) {
  return useQuery({
    queryKey: queryKeys.stock.list({ ...filters }),
    queryFn: () => stockService.listMovements(filters),
  });
}
