import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Tags } from "lucide-react";

import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { ConfirmDialog, EmptyState, ErrorState } from "@/components/states";
import { CategoriesTable } from "../components/CategoriesTable";
import { CategoriesTableSkeleton } from "../components/CategoriesTableSkeleton";
import { CategoryFormSheet } from "../components/CategoryFormSheet";
import {
  useDeleteCategory,
  useReactivateCategory,
} from "../categories.mutations";
import { useCategories } from "../categories.queries";
import type { Category } from "../categories.types";

const PAGE_SIZE = 10;

export default function CategoriesPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("all");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [deactivateTarget, setDeactivateTarget] = useState<Category | null>(null);

  function changeStatus(value: string) {
    setStatus(value);
    setPage(1);
  }

  const categoriesQuery = useCategories({
    page,
    pageSize: PAGE_SIZE,
    active: status === "all" ? undefined : status === "active",
  });
  const deactivateMutation = useDeleteCategory();
  const reactivateMutation = useReactivateCategory();

  const categories = categoriesQuery.data?.data ?? [];
  const meta = categoriesQuery.data?.meta;
  const totalPages = meta?.totalPages ?? 1;

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(category: Category) {
    setEditing(category);
    setFormOpen(true);
  }

  // Inativação: mesmo fluxo do menu (DELETE). Fecha a edição e abre a confirmação.
  function requestDeactivate(category: Category) {
    setFormOpen(false);
    setDeactivateTarget(category);
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

  // Reativação: fecha a edição e dispara a mutation (interface preparada).
  function handleReactivate(category: Category) {
    setFormOpen(false);
    reactivateMutation.mutate(category.id);
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="space-y-2">
        <Breadcrumb items={[{ label: "Início", to: "/" }, { label: "Categorias" }]} />
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Categorias</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Organização dos produtos por categoria.
            </p>
          </div>
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" />
            Nova categoria
          </Button>
        </div>
      </div>

      {/* Filtro de status */}
      <div className="flex items-end gap-2">
        <div className="w-full space-y-1.5 sm:w-52">
          <Label className="text-xs text-muted-foreground">Status</Label>
          <Select
            value={status}
            onChange={(e) => changeStatus(e.target.value)}
            aria-label="Filtrar por status"
          >
            <option value="all">Todas</option>
            <option value="active">Ativas</option>
            <option value="inactive">Inativas</option>
          </Select>
        </div>
      </div>

      {/* Conteúdo */}
      <Card>
        <CardContent className="p-0">
          {categoriesQuery.isLoading ? (
            <CategoriesTableSkeleton />
          ) : categoriesQuery.isError ? (
            <ErrorState
              title="Não foi possível carregar as categorias"
              description="Verifique sua conexão com a API e tente novamente."
              onRetry={() => categoriesQuery.refetch()}
              className="border-0"
            />
          ) : categories.length === 0 ? (
            <EmptyState
              icon={Tags}
              title="Nenhuma categoria encontrada"
              description={
                status !== "all"
                  ? "Tente ajustar o filtro de status."
                  : "Cadastre a primeira categoria para começar."
              }
              className="border-0"
            />
          ) : (
            <CategoriesTable
              categories={categories}
              onEdit={openEdit}
              onDeactivate={setDeactivateTarget}
              onReactivate={handleReactivate}
            />
          )}
        </CardContent>
      </Card>

      {/* Paginação */}
      {!categoriesQuery.isLoading &&
        !categoriesQuery.isError &&
        categories.length > 0 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {meta
                ? `${meta.total} categoria(s) — página ${meta.page} de ${totalPages}`
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
      <CategoryFormSheet
        open={formOpen}
        onOpenChange={setFormOpen}
        category={editing}
        onRequestDeactivate={requestDeactivate}
        onRequestReactivate={handleReactivate}
      />

      <ConfirmDialog
        open={Boolean(deactivateTarget)}
        onOpenChange={(open) => !open && setDeactivateTarget(null)}
        title="Inativar categoria"
        description={
          deactivateTarget
            ? `Tem certeza que deseja inativar "${deactivateTarget.name}"? Você poderá reativá-la depois.`
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
