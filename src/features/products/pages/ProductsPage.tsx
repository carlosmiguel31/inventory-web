import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Package, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ConfirmDialog, EmptyState, ErrorState } from "@/components/states";
import { useCategories } from "@/features/categories";
import { useSuppliers } from "@/features/suppliers";
import { useDebounce } from "@/hooks/useDebounce";
import type { ListParams } from "@/types/common";
import { ProductFilters } from "../components/ProductFilters";
import { ProductFormSheet } from "../components/ProductFormSheet";
import { ProductsTable } from "../components/ProductsTable";
import { ProductsTableSkeleton } from "../components/ProductsTableSkeleton";
import {
  useDeleteProduct,
  useReactivateProduct,
} from "../products.mutations";
import { useProducts } from "../products.queries";
import type { Product } from "../products.types";

const PAGE_SIZE = 10;

export default function ProductsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [status, setStatus] = useState("all");

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [deactivateTarget, setDeactivateTarget] = useState<Product | null>(null);

  const debouncedSearch = useDebounce(search, 400);

  // Filtros alteram a lista => sempre voltar para a página 1.
  function resetTo<T>(setter: (v: T) => void) {
    return (value: T) => {
      setter(value);
      setPage(1);
    };
  }

  const params: ListParams = {
    page,
    pageSize: PAGE_SIZE,
    search: debouncedSearch || undefined,
    categoryId: categoryId || undefined,
    active: status === "all" ? undefined : status === "active",
  };

  const productsQuery = useProducts(params);
  const categoriesQuery = useCategories({ pageSize: 100 });
  const suppliersQuery = useSuppliers({ pageSize: 100 });
  const deactivateMutation = useDeleteProduct();
  const reactivateMutation = useReactivateProduct();

  const categories = categoriesQuery.data?.data ?? [];
  const suppliers = suppliersQuery.data?.data ?? [];

  const categoryMap = useMemo(() => {
    const map = new Map<string, string>();
    categories.forEach((c) => map.set(c.id, c.name));
    return map;
  }, [categories]);

  const products = productsQuery.data?.data ?? [];
  const meta = productsQuery.data?.meta;
  const totalPages = meta?.totalPages ?? 1;

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(product: Product) {
    setEditing(product);
    setFormOpen(true);
  }

  async function confirmDeactivate() {
    if (!deactivateTarget) return;
    try {
      await deactivateMutation.mutateAsync(deactivateTarget.id);
      setDeactivateTarget(null);
    } catch {
      // erro tratado via toast global
    }
  }

  function handleReactivate(product: Product) {
    reactivateMutation.mutate(product.id);
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho da página */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Produtos</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Cadastro e gestão dos produtos do estoque.
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" />
          Novo produto
        </Button>
      </div>

      {/* Filtros */}
      <ProductFilters
        search={search}
        onSearchChange={resetTo(setSearch)}
        categoryId={categoryId}
        onCategoryChange={resetTo(setCategoryId)}
        status={status}
        onStatusChange={resetTo(setStatus)}
        categories={categories}
      />

      {/* Conteúdo */}
      <Card>
        <CardContent className="p-0">
          {productsQuery.isLoading ? (
            <ProductsTableSkeleton />
          ) : productsQuery.isError ? (
            <ErrorState
              title="Não foi possível carregar os produtos"
              description="Verifique sua conexão com a API e tente novamente."
              onRetry={() => productsQuery.refetch()}
              className="border-0"
            />
          ) : products.length === 0 ? (
            <EmptyState
              icon={Package}
              title="Nenhum produto encontrado"
              description={
                debouncedSearch || categoryId || status !== "all"
                  ? "Tente ajustar a busca ou os filtros."
                  : "Cadastre o primeiro produto para começar."
              }
              className="border-0"
            />
          ) : (
            <ProductsTable
              products={products}
              categoryMap={categoryMap}
              onEdit={openEdit}
              onDeactivate={setDeactivateTarget}
              onReactivate={handleReactivate}
            />
          )}
        </CardContent>
      </Card>

      {/* Paginação */}
      {!productsQuery.isLoading && !productsQuery.isError && products.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {meta
              ? `${meta.total} produto(s) — página ${meta.page} de ${totalPages}`
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

      {/* Modais */}
      <ProductFormSheet
        open={formOpen}
        onOpenChange={setFormOpen}
        product={editing}
        categories={categories}
        suppliers={suppliers}
      />

      <ConfirmDialog
        open={Boolean(deactivateTarget)}
        onOpenChange={(open) => !open && setDeactivateTarget(null)}
        title="Inativar produto"
        description={
          deactivateTarget
            ? `Tem certeza que deseja inativar "${deactivateTarget.name}"? Você poderá reativá-lo depois.`
            : undefined
        }
        confirmLabel="Inativar"
        destructive
        loading={deactivateMutation.isPending}
        onConfirm={confirmDeactivate}
      />
    </div>
  );
}
