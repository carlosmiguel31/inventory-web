import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/query-keys";
import { reportsService } from "./reports.service";

export function useReportsSummary() {
  return useQuery({
    queryKey: queryKeys.reports.summary(),
    queryFn: () => reportsService.getSummary(),
  });
}

export function useLowStock(activeOnly: boolean) {
  return useQuery({
    queryKey: ["reports", "low-stock", activeOnly],
    queryFn: () => reportsService.getLowStock(activeOnly),
  });
}
