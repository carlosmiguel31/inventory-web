import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/query-keys";
import { reportsService } from "./reports.service";

export function useReportSummary() {
  return useQuery({
    queryKey: queryKeys.reports.summary(),
    queryFn: () => reportsService.getSummary(),
  });
}

export function useReports() {
  return useQuery({
    queryKey: queryKeys.reports.overview(),
    queryFn: () => reportsService.getOverview(),
  });
}
