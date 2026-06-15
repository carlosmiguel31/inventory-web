import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowDownRight,
  ArrowLeftRight,
  ArrowUpRight,
  Archive,
  Boxes,
  Package,
  Plus,
  SlidersHorizontal,
  TriangleAlert,
  Truck,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useProducts } from "@/features/products";
import { useLowStock, useReportsSummary } from "@/features/reports";
import { useSuppliers } from "@/features/suppliers";
import {
  MOVEMENT_TYPE_LABELS,
  movementDirection,
} from "@/features/stock/stock.constants";
import { useStockMovements } from "@/features/stock/stock.queries";
import type { StockMovement } from "@/features/stock/stock.types";
import { formatDateTime } from "@/features/stock/stock.utils";

const RECENT_LIMIT = 6;

function directionVisual(type: StockMovement["type"]) {
  const dir = movementDirection(type);
  if (dir === "entry")
    return { icon: ArrowDownRight, className: "bg-success/15 text-success" };
  if (dir === "output")
    return { icon: ArrowUpRight, className: "bg-destructive/15 text-destructive" };
  if (dir === "adjustment")
    return {
      icon: SlidersHorizontal,
      className: "bg-secondary text-muted-foreground",
    };
  return { icon: ArrowLeftRight, className: "bg-secondary text-muted-foreground" };
}

export function Dashboard() {
  const navigate = useNavigate();

  const summaryQuery = useReportsSummary();
  // Mesmos dados de estoque baixo do módulo Relatórios (apenas ativos).
  const lowStockQuery = useLowStock("active");
  const suppliersQuery = useSuppliers({ page: 1, pageSize: 1 });
  const movementsQuery = useStockMovements({ pageSize: RECENT_LIMIT });
  // Resolve o nome do produto nas movimentações (quando não vem embutido).
  const productsQuery = useProducts({ pageSize: 100 });

  const summary = summaryQuery.data;
  const lowStockItems = lowStockQuery.data ?? [];
  const lowStockCount = lowStockQuery.data?.length ?? null;
  const suppliersTotal = suppliersQuery.data?.meta?.total ?? null;

  const productMap = useMemo(() => {
    const map = new Map<string, string>();
    (productsQuery.data?.data ?? []).forEach((p) =>
      map.set(String(p.id), p.name),
    );
    return map;
  }, [productsQuery.data]);

  const movements = useMemo(() => {
    const list = [...(movementsQuery.data?.data ?? [])];
    list.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    return list.slice(0, RECENT_LIMIT);
  }, [movementsQuery.data]);

  function productName(mv: StockMovement): string {
    return mv.product?.name ?? productMap.get(String(mv.productId)) ?? "Produto";
  }

  // Cards: só os com dado real (ou carregando) entram — nunca exibe placeholder.
  const cards = [
    {
      key: "products",
      label: "Total de produtos",
      value: summary?.totalProducts ?? null,
      icon: Package,
      loading: summaryQuery.isLoading,
      highlight: false,
    },
    {
      key: "active",
      label: "Produtos ativos",
      value: summary?.activeProducts ?? null,
      icon: Boxes,
      loading: summaryQuery.isLoading,
      highlight: false,
    },
    {
      key: "inactive",
      label: "Produtos inativos",
      value: summary?.inactiveProducts ?? null,
      icon: Archive,
      loading: summaryQuery.isLoading,
      highlight: false,
    },
    {
      key: "lowstock",
      label: "Estoque baixo",
      value: lowStockCount,
      icon: TriangleAlert,
      loading: lowStockQuery.isLoading,
      highlight: true,
    },
    {
      key: "users",
      label: "Total de usuários",
      value: summary?.totalUsers ?? null,
      icon: Users,
      loading: summaryQuery.isLoading,
      highlight: false,
    },
    {
      key: "suppliers",
      label: "Total de fornecedores",
      value: suppliersTotal,
      icon: Truck,
      loading: suppliersQuery.isLoading,
      highlight: false,
    },
  ];
  const visibleCards = cards.filter((c) => c.loading || c.value !== null);

  return (
    <div className="space-y-6">
      {/* Cabeçalho da página */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Visão geral do estoque.
          </p>
        </div>
        <Button onClick={() => navigate("/products")}>
          <Plus className="h-4 w-4" />
          Novo produto
        </Button>
      </div>

      {/* KPIs (dados reais) */}
      {visibleCards.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visibleCards.map(
            ({ key, label, value, icon: Icon, loading, highlight }) => (
              <Card key={key}>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">{label}</p>
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-secondary/60 text-muted-foreground">
                      <Icon className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="mt-3">
                    {loading ? (
                      <Skeleton className="h-8 w-16" />
                    ) : (
                      <span
                        className={cn(
                          "text-2xl font-semibold tabular-nums tracking-tight",
                          highlight &&
                            value !== null &&
                            value > 0 &&
                            "text-destructive",
                        )}
                      >
                        {value}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ),
          )}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Estoque baixo (dados reais — mesmos do módulo Relatórios) */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-base">Estoque baixo</CardTitle>
              <CardDescription>Itens abaixo do mínimo definido</CardDescription>
            </div>
            {!lowStockQuery.isLoading && !lowStockQuery.isError && (
              <Badge variant="warning">{lowStockItems.length} alertas</Badge>
            )}
          </CardHeader>
          <CardContent className="p-0">
            {lowStockQuery.isLoading ? (
              <div className="space-y-3 px-6 py-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            ) : lowStockQuery.isError ? (
              <div className="px-6 py-10 text-center">
                <p className="text-sm text-muted-foreground">
                  Não foi possível carregar o estoque baixo.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  onClick={() => lowStockQuery.refetch()}
                >
                  Tentar novamente
                </Button>
              </div>
            ) : lowStockItems.length === 0 ? (
              <div className="px-6 py-10 text-center text-sm text-muted-foreground">
                Nenhum item abaixo do estoque mínimo.
              </div>
            ) : (
              <div className="divide-y divide-border">
                {lowStockItems.slice(0, RECENT_LIMIT).map((p) => (
                  <div
                    key={String(p.id)}
                    className="flex items-center justify-between px-6 py-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{p.name}</p>
                      <p className="font-mono text-xs text-muted-foreground">
                        {p.sku || "—"}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-medium tabular-nums">
                          {p.quantity}{" "}
                          <span className="text-muted-foreground">
                            / {p.minQuantity}
                          </span>
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          em estoque / mínimo
                        </p>
                      </div>
                      <div className="h-9 w-1.5 overflow-hidden rounded-full bg-border">
                        <div
                          className="w-full rounded-full bg-warning"
                          style={{
                            height: `${
                              p.minQuantity > 0
                                ? Math.min(
                                    100,
                                    (p.quantity / p.minQuantity) * 100,
                                  )
                                : 0
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Atividade recente (movimentações reais) */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Atividade recente</CardTitle>
            <CardDescription>Últimas movimentações</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {movementsQuery.isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-7 w-7 rounded-full" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-3.5 w-2/3" />
                    <Skeleton className="h-3 w-1/3" />
                  </div>
                </div>
              ))
            ) : movementsQuery.isError ? (
              <div className="py-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Não foi possível carregar as movimentações.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  onClick={() => movementsQuery.refetch()}
                >
                  Tentar novamente
                </Button>
              </div>
            ) : movements.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                Sem movimentações recentes.
              </p>
            ) : (
              movements.map((mv) => {
                const { icon: Icon, className } = directionVisual(mv.type);
                return (
                  <div key={String(mv.id)} className="flex items-start gap-3">
                    <div
                      className={cn(
                        "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
                        className,
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {productName(mv)}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {MOVEMENT_TYPE_LABELS[mv.type] ?? mv.type}
                      </p>
                    </div>
                    <span className="whitespace-nowrap text-[11px] text-muted-foreground">
                      {formatDateTime(mv.createdAt)}
                    </span>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
