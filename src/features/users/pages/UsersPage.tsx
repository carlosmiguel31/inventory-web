import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Search, Users } from "lucide-react";

import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ConfirmDialog, EmptyState, ErrorState } from "@/components/states";
import { useAuth } from "@/hooks/useAuth";
import { useDebounce } from "@/hooks/useDebounce";
import { UserFormSheet } from "../components/UserFormSheet";
import { UsersTable } from "../components/UsersTable";
import { UsersTableSkeleton } from "../components/UsersTableSkeleton";
import { canManageUsers } from "../users.constants";
import { useDeactivateUser, useReactivateUser } from "../users.mutations";
import { useUsers } from "../users.queries";
import type { User } from "../users.types";

const PAGE_SIZE = 10;

export default function UsersPage() {
  const { user: currentUser } = useAuth();
  const canManage = canManageUsers(currentUser?.role);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [deactivateTarget, setDeactivateTarget] = useState<User | null>(null);

  const debouncedSearch = useDebounce(search, 400);

  function changeSearch(value: string) {
    setSearch(value);
    setPage(1);
  }

  const usersQuery = useUsers({
    page,
    pageSize: PAGE_SIZE,
    search: debouncedSearch || undefined,
  });

  const deactivateMutation = useDeactivateUser();
  const reactivateMutation = useReactivateUser();

  const users = usersQuery.data?.data ?? [];
  const meta = usersQuery.data?.meta;
  const totalPages = meta?.totalPages ?? 1;

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(user: User) {
    setEditing(user);
    setFormOpen(true);
  }

  function confirmDeactivate() {
    if (!deactivateTarget) return;
    deactivateMutation.mutate(String(deactivateTarget.id), {
      onSuccess: () => setDeactivateTarget(null),
    });
  }

  function handleReactivate(user: User) {
    reactivateMutation.mutate(String(user.id));
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="space-y-2">
        <Breadcrumb items={[{ label: "Início", to: "/" }, { label: "Usuários" }]} />
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Usuários</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Gestão de usuários e permissões.
            </p>
          </div>
          {canManage && (
            <Button onClick={openCreate}>
              <Plus className="h-4 w-4" />
              Novo usuário
            </Button>
          )}
        </div>
      </div>

      {/* Busca por nome/e-mail */}
      <div className="relative max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Buscar usuário..."
          className="pl-9"
          value={search}
          onChange={(e) => changeSearch(e.target.value)}
        />
      </div>

      {/* Conteúdo */}
      <Card>
        <CardContent className="p-0">
          {usersQuery.isLoading ? (
            <UsersTableSkeleton />
          ) : usersQuery.isError ? (
            <ErrorState
              title="Não foi possível carregar os usuários"
              description="Verifique sua conexão com a API e tente novamente."
              onRetry={() => usersQuery.refetch()}
              className="border-0"
            />
          ) : users.length === 0 ? (
            <EmptyState
              icon={Users}
              title="Nenhum usuário encontrado"
              description={
                debouncedSearch
                  ? "Tente ajustar a busca."
                  : "Cadastre o primeiro usuário para começar."
              }
              className="border-0"
            />
          ) : (
            <UsersTable
              users={users}
              canManage={canManage}
              onEdit={openEdit}
              onDeactivate={setDeactivateTarget}
              onReactivate={handleReactivate}
            />
          )}
        </CardContent>
      </Card>

      {/* Paginação */}
      {!usersQuery.isLoading && !usersQuery.isError && users.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {meta
              ? `${meta.total} usuário(s) — página ${meta.page} de ${totalPages}`
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

      {/* Modal de cadastro/edição (apenas quem gerencia) */}
      {canManage && (
        <UserFormSheet open={formOpen} onOpenChange={setFormOpen} user={editing} />
      )}

      {/* Confirmação antes de inativar */}
      <ConfirmDialog
        open={Boolean(deactivateTarget)}
        onOpenChange={(open) => !open && setDeactivateTarget(null)}
        title="Inativar usuário"
        description={
          deactivateTarget
            ? `Tem certeza que deseja inativar "${deactivateTarget.name}"? Ele perderá o acesso até ser reativado.`
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
