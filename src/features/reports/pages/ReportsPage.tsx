import { useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Package,
  Users,
  XCircle,
} from "lucide-react";

import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { EmptyState, ErrorState } from "@/components/states";
import { cn } from "@/lib/utils";
import { LowStockTable } from "../components/LowStockTable";
import { LowStockTableSkeleton } from "../components/LowStockTableSkeleton";
import { SummaryCard } from "../components/SummaryCard";
import { useLowStock, useReportsSummary } from "../reports.queries";
import type { LowStockFilter } from "../reports.types";

// Classes estáticas (Tailwind precisa vê-las) — uma coluna por card visível,
// garantindo uma linha cheia, sem células vazias no desktop.
const LG_COLS: Record<number, string> = {
  1: "lg:grid-cols-1",
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
  5: "lg:grid-cols-5",
};

export default function ReportsPage() {
  const [stockFilter, setStockFilter] = useState<LowStockFilter>("all");

  const summaryQuery = useReportsSummary();
  const lowStockQuery = useLowStock(stockFilter);

  const summary = summaryQuery.data;
  const lowStockCount = lowStockQuery.data?.length ?? null;

  const cards = [
    {
      key: "products",
      label: "Total de Produtos",
      value: summary?.totalProducts ?? null,
      icon: Package,
      loading: summaryQuery.isLoading,
      highlight: false,
    },
    {
      key: "active",
      label: "Produtos Ativos",
      value: summary?.activeProducts ?? null,
      icon: CheckCircle2,
      loading: summaryQuery.isLoading,
      highlight: false,
    },
    {
      key: "inactive",
      label: "Produtos Inativos",
      value: summary?.inactiveProducts ?? null,
      icon: XCircle,
      loading: summaryQuery.isLoading,
      highlight: false,
    },
    {
      key: "lowstock",
      label: "Estoque Baixo",
      value: lowStockCount,
      icon: AlertTriangle,
      loading: lowStockQuery.isLoading,
      highlight: true,
    },
    {
      key: "users",
      label: "Total de Usuários",
      value: summary?.totalUsers ?? null,
      icon: Users,
      loading: summaryQuery.isLoading,
      highlight: false,
    },
  ];

  // Só exibe cards com dado real (ou ainda carregando). Nunca "Indisponível".
  const visibleCards = cards.filter((c) => c.loading || c.value !== null);
  const lgCols = LG_COLS[Math.min(visibleCards.length, 5)] ?? "lg:grid-cols-4";

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="space-y-2">
        <Breadcrumb items={[{ label: "Início", to: "/" }, { label: "Relatórios" }]} />
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Relatórios</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Indicadores consolidados e estoque baixo.
          </p>
        </div>
      </div>

      {/* Cards de resumo — apenas indicadores calculáveis hoje */}
      {visibleCards.length > 0 && (
        <div className={cn("grid grid-cols-1 gap-4 sm:grid-cols-2", lgCols)}>
          {visibleCards.map((c) => (
            <SummaryCard
              key={c.key}
              label={c.label}
              value={c.value}
              icon={c.icon}
              loading={c.loading}
              highlight={c.highlight}
            />
          ))}
        </div>
      )}

      {/* Relatório de estoque baixo */}
      <div className="space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">Estoque Baixo</h2>
            <p className="text-sm text-muted-foreground">
              Produtos com estoque atual igual ou abaixo do mínimo.
            </p>
          </div>
          <div className="w-full space-y-1.5 sm:w-56">
            <Label className="text-xs text-muted-foreground">Produtos</Label>
            <Select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value as LowStockFilter)}
              aria-label="Filtrar produtos considerados"
            >
              <option value="all">Todos</option>
              <option value="active">Apenas ativos</option>
              <option value="inactive">Apenas inativos</option>
            </Select>
          </div>
        </div>

        <Card>
          <CardContent className="p-0">
            {lowStockQuery.isLoading ? (
              <LowStockTableSkeleton />
            ) : lowStockQuery.isError ? (
              <ErrorState
                title="Não foi possível carregar o estoque baixo"
                description="Verifique sua conexão com a API e tente novamente."
                onRetry={() => lowStockQuery.refetch()}
                className="border-0"
              />
            ) : !lowStockQuery.data || lowStockQuery.data.length === 0 ? (
              <EmptyState
                icon={AlertTriangle}
                title="Nenhum produto com estoque baixo"
                description="Todos os produtos do filtro selecionado estão acima do estoque mínimo."
                className="border-0"
              />
            ) : (
              <LowStockTable items={lowStockQuery.data} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
