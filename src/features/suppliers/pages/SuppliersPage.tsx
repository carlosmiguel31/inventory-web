import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Search, Truck } from "lucide-react";

import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { EmptyState, ErrorState } from "@/components/states";
import { useDebounce } from "@/hooks/useDebounce";
import { SupplierFormSheet } from "../components/SupplierFormSheet";
import { SuppliersTable } from "../components/SuppliersTable";
import { SuppliersTableSkeleton } from "../components/SuppliersTableSkeleton";
import { useSuppliers } from "../suppliers.queries";
import type { Supplier } from "../suppliers.types";

const PAGE_SIZE = 10;

export default function SuppliersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Supplier | null>(null);

  const debouncedSearch = useDebounce(search, 400);

  function changeSearch(value: string) {
    setSearch(value);
    setPage(1);
  }

  const suppliersQuery = useSuppliers({
    page,
    pageSize: PAGE_SIZE,
    search: debouncedSearch || undefined,
  });

  const suppliers = suppliersQuery.data?.data ?? [];
  const meta = suppliersQuery.data?.meta;
  const totalPages = meta?.totalPages ?? 1;

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(supplier: Supplier) {
    setEditing(supplier);
    setFormOpen(true);
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="space-y-2">
        <Breadcrumb items={[{ label: "Início", to: "/" }, { label: "Fornecedores" }]} />
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Fornecedores</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Cadastro e gestão de fornecedores.
            </p>
          </div>
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" />
            Novo fornecedor
          </Button>
        </div>
      </div>

      {/* Busca por nome */}
      <div className="relative max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Buscar por nome..."
          className="pl-9"
          value={search}
          onChange={(e) => changeSearch(e.target.value)}
        />
      </div>

      {/* Conteúdo */}
      <Card>
        <CardContent className="p-0">
          {suppliersQuery.isLoading ? (
            <SuppliersTableSkeleton />
          ) : suppliersQuery.isError ? (
            <ErrorState
              title="Não foi possível carregar os fornecedores"
              description="Verifique sua conexão com a API e tente novamente."
              onRetry={() => suppliersQuery.refetch()}
              className="border-0"
            />
          ) : suppliers.length === 0 ? (
            <EmptyState
              icon={Truck}
              title="Nenhum fornecedor encontrado"
              description={
                debouncedSearch
                  ? "Tente ajustar a busca."
                  : "Cadastre o primeiro fornecedor para começar."
              }
              className="border-0"
            />
          ) : (
            <SuppliersTable suppliers={suppliers} onEdit={openEdit} />
          )}
        </CardContent>
      </Card>

      {/* Paginação */}
      {!suppliersQuery.isLoading &&
        !suppliersQuery.isError &&
        suppliers.length > 0 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {meta
                ? `${meta.total} fornecedor(es) — página ${meta.page} de ${totalPages}`
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

      {/* Modal de cadastro/edição */}
      <SupplierFormSheet
        open={formOpen}
        onOpenChange={setFormOpen}
        supplier={editing}
      />
    </div>
  );
}
