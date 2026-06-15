import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/query-keys";
import { reportsService } from "./reports.service";
import type { LowStockFilter } from "./reports.types";

export function useReportsSummary() {
  return useQuery({
    queryKey: queryKeys.reports.summary(),
    queryFn: () => reportsService.getSummary(),
  });
}

export function useLowStock(filter: LowStockFilter) {
  return useQuery({
    queryKey: ["reports", "low-stock", filter],
    queryFn: () => reportsService.getLowStock(filter),
  });
}
