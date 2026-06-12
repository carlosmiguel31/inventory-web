import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Plus, Boxes } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState, ErrorState } from "@/components/states";
import { useProducts } from "@/features/products";
import { useUsers } from "@/features/users";
import { StockFilters } from "../components/StockFilters";
import { StockMovementsTable } from "../components/StockMovementsTable";
import { StockMovementsTableSkeleton } from "../components/StockMovementsTableSkeleton";
import { useStockMovements } from "../stock.queries";
import type { StockMovementFilters } from "../stock.types";

const PAGE_SIZE = 10;

export default function StockMovementsPage() {
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [productId, setProductId] = useState("");
  const [type, setType] = useState("");
  const [userId, setUserId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  function resetTo<T>(setter: (v: T) => void) {
    return (value: T) => {
      setter(value);
      setPage(1);
    };
  }

  const filters: StockMovementFilters = {
    page,
    pageSize: PAGE_SIZE,
    productId: productId || undefined,
    type: type || undefined,
    userId: userId || undefined,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
  };

  const movementsQuery = useStockMovements(filters);
  const productsQuery = useProducts({ pageSize: 100 });
  const usersQuery = useUsers({ pageSize: 100 });

  const products = productsQuery.data?.data ?? [];
  const users = usersQuery.data?.data ?? [];

  const productMap = useMemo(() => {
    const map = new Map<string, { name: string; sku: string }>();
    products.forEach((p) => map.set(p.id, { name: p.name, sku: p.sku }));
    return map;
  }, [products]);

  const userMap = useMemo(() => {
    const map = new Map<string, string>();
    users.forEach((u) => map.set(u.id, u.name));
    return map;
  }, [users]);

  const movements = movementsQuery.data?.data ?? [];
  const meta = movementsQuery.data?.meta;
  const totalPages = meta?.totalPages ?? 1;
  const hasFilters = Boolean(
    productId || type || userId || startDate || endDate,
  );

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Movimentações de estoque
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Entradas, saídas, ajustes e perdas do estoque.
          </p>
        </div>
        <Button onClick={() => navigate("/stock/new")}>
          <Plus className="h-4 w-4" />
          Nova movimentação
        </Button>
      </div>

      {/* Filtros */}
      <StockFilters
        productId={productId}
        onProductChange={resetTo(setProductId)}
        type={type}
        onTypeChange={resetTo(setType)}
        userId={userId}
        onUserChange={resetTo(setUserId)}
        startDate={startDate}
        onStartDateChange={resetTo(setStartDate)}
        endDate={endDate}
        onEndDateChange={resetTo(setEndDate)}
        products={products}
        users={users}
      />

      {/* Conteúdo */}
      <Card>
        <CardContent className="p-0">
          {movementsQuery.isLoading ? (
            <StockMovementsTableSkeleton />
          ) : movementsQuery.isError ? (
            <ErrorState
              title="Não foi possível carregar as movimentações"
              description="Verifique sua conexão com a API e tente novamente."
              onRetry={() => movementsQuery.refetch()}
              className="border-0"
            />
          ) : movements.length === 0 ? (
            <EmptyState
              icon={Boxes}
              title="Nenhuma movimentação encontrada"
              description={
                hasFilters
                  ? "Tente ajustar os filtros."
                  : "Registre a primeira movimentação de estoque."
              }
              className="border-0"
            />
          ) : (
            <StockMovementsTable
              movements={movements}
              productMap={productMap}
              userMap={userMap}
            />
          )}
        </CardContent>
      </Card>

      {/* Paginação */}
      {!movementsQuery.isLoading &&
        !movementsQuery.isError &&
        movements.length > 0 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {meta
                ? `${meta.total} movimentação(ões) — página ${meta.page} de ${totalPages}`
                : `Página ${page}`}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= totalPages}
              >
                Próxima
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
    </div>
  );
}
