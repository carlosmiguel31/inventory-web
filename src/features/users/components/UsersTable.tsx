import { Ban, MoreHorizontal, Pencil, RotateCcw } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { roleLabel } from "../users.constants";
import type { User } from "../users.types";
import { formatDate } from "../users.utils";

interface UsersTableProps {
  users: User[];
  /** Quando false, oculta toda a coluna de ações (gate de perfil). */
  canManage: boolean;
  onEdit: (user: User) => void;
  onDeactivate: (user: User) => void;
  onReactivate: (user: User) => void;
}

export function UsersTable({
  users,
  canManage,
  onEdit,
  onDeactivate,
  onReactivate,
}: UsersTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead>Nome</TableHead>
          <TableHead>E-mail</TableHead>
          <TableHead>Perfil</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Criado em</TableHead>
          {canManage && <TableHead className="w-12" />}
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell className="font-medium">{user.name}</TableCell>
            <TableCell className="text-muted-foreground">{user.email}</TableCell>
            <TableCell>
              <Badge variant="secondary">{roleLabel(user.role)}</Badge>
            </TableCell>
            <TableCell>
              <Badge variant={user.active ? "success" : "secondary"}>
                {user.active ? "Ativo" : "Inativo"}
              </Badge>
            </TableCell>
            <TableCell className="text-muted-foreground">
              {formatDate(user.createdAt)}
            </TableCell>
            {canManage && (
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      aria-label="Ações"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(user)}>
                      <Pencil />
                      Editar
                    </DropdownMenuItem>
                    {user.active ? (
                      <DropdownMenuItem
                        onClick={() => onDeactivate(user)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Ban />
                        Inativar
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem onClick={() => onReactivate(user)}>
                        <RotateCcw />
                        Reativar
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
