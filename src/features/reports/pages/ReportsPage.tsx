import { useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Package,
  Tags,
  Truck,
  Users,
  XCircle,
} from "lucide-react";

import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { EmptyState, ErrorState } from "@/components/states";
import { LowStockTable } from "../components/LowStockTable";
import { LowStockTableSkeleton } from "../components/LowStockTableSkeleton";
import { SummaryCard } from "../components/SummaryCard";
import { useLowStock, useReportsSummary } from "../reports.queries";

export default function ReportsPage() {
  const [activeOnly, setActiveOnly] = useState(true);

  const summaryQuery = useReportsSummary();
  const lowStockQuery = useLowStock(activeOnly);

  const summary = summaryQuery.data;
  const lowStockCount = lowStockQuery.data?.length ?? null;

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

      {/* Cards de resumo — cada card é independente; dado ausente => "Indisponível" */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard
            label="Total de Produtos"
            value={summary?.totalProducts ?? null}
            icon={Package}
            loading={summaryQuery.isLoading}
          />
          <SummaryCard
            label="Produtos Ativos"
            value={summary?.activeProducts ?? null}
            icon={CheckCircle2}
            loading={summaryQuery.isLoading}
          />
          <SummaryCard
            label="Produtos Inativos"
            value={summary?.inactiveProducts ?? null}
            icon={XCircle}
            loading={summaryQuery.isLoading}
          />
          <SummaryCard
            label="Estoque Baixo"
            value={lowStockCount}
            icon={AlertTriangle}
            loading={lowStockQuery.isLoading}
            highlight
          />
          <SummaryCard
            label="Total de Categorias"
            value={summary?.totalCategories ?? null}
            icon={Tags}
            loading={summaryQuery.isLoading}
          />
          <SummaryCard
            label="Total de Fornecedores"
            value={summary?.totalSuppliers ?? null}
            icon={Truck}
            loading={summaryQuery.isLoading}
          />
          <SummaryCard
            label="Total de Usuários"
            value={summary?.totalUsers ?? null}
            icon={Users}
            loading={summaryQuery.isLoading}
          />
        </div>

      {/* Relatório de estoque baixo */}
      <div className="space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">
              Estoque Baixo
            </h2>
            <p className="text-sm text-muted-foreground">
              Produtos com estoque atual igual ou abaixo do mínimo.
            </p>
          </div>
          <div className="w-full space-y-1.5 sm:w-52">
            <Label className="text-xs text-muted-foreground">Produtos</Label>
            <Select
              value={activeOnly ? "active" : "all"}
              onChange={(e) => setActiveOnly(e.target.value === "active")}
              aria-label="Filtrar produtos considerados"
            >
              <option value="active">Apenas ativos</option>
              <option value="all">Todos</option>
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
                description="Todos os produtos avaliados estão acima do estoque mínimo."
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
