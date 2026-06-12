import { MoreHorizontal, Pencil } from "lucide-react";

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
import type { Category } from "../categories.types";
import { formatDate } from "../categories.utils";

interface CategoriesTableProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  // TODO(backend): reintroduzir onDeactivate/onReactivate quando houver
  // endpoint de inativação/reativação de categorias.
}

export function CategoriesTable({ categories, onEdit }: CategoriesTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead>Nome</TableHead>
          <TableHead>Código</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Criado em</TableHead>
          <TableHead className="w-12" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {categories.map((category) => (
          <TableRow key={category.id}>
            <TableCell className="font-medium">{category.name}</TableCell>
            <TableCell className="font-mono text-xs text-muted-foreground">
              {category.code || "—"}
            </TableCell>
            <TableCell>
              <Badge variant={category.active ? "success" : "secondary"}>
                {category.active ? "Ativo" : "Inativo"}
              </Badge>
            </TableCell>
            <TableCell className="text-muted-foreground">
              {formatDate(category.createdAt)}
            </TableCell>
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
                  <DropdownMenuItem onClick={() => onEdit(category)}>
                    <Pencil />
                    Editar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
