import { api } from "@/lib/axios";
import type { InventorySummary, Report } from "./reports.types";

/**
 * Relatórios não seguem o padrão CRUD — expõem endpoints específicos.
 * Ajuste as rotas conforme o backend.
 */
export const reportsService = {
  getSummary: async (): Promise<InventorySummary> => {
    const { data } = await api.get<InventorySummary>("/api/reports/summary");
    return data;
  },
  getOverview: async (): Promise<Report> => {
    const { data } = await api.get<Report>("/api/reports/overview");
    return data;
  },
};
