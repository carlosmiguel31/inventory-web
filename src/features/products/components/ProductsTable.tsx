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
import { cn } from "@/lib/utils";
import type { Product } from "../products.types";
import { formatDate } from "../products.utils";

interface ProductsTableProps {
  products: Product[];
  categoryMap: Map<string, string>;
  onEdit: (product: Product) => void;
  onDeactivate: (product: Product) => void;
  onReactivate: (product: Product) => void;
}

export function ProductsTable({
  products,
  categoryMap,
  onEdit,
  onDeactivate,
  onReactivate,
}: ProductsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead>Nome</TableHead>
          <TableHead>SKU</TableHead>
          <TableHead>Categoria</TableHead>
          <TableHead className="text-right">Estoque atual</TableHead>
          <TableHead className="text-right">Estoque mín.</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Criado em</TableHead>
          <TableHead className="w-12" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => {
          const low = product.quantity <= product.minQuantity;
          return (
            <TableRow key={product.id}>
              <TableCell className="font-medium">{product.name}</TableCell>
              <TableCell className="font-mono text-xs text-muted-foreground">
                {product.sku}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {product.categoryId
                  ? categoryMap.get(product.categoryId) ?? "—"
                  : "—"}
              </TableCell>
              <TableCell
                className={cn(
                  "text-right tabular-nums",
                  low && "font-medium text-warning",
                )}
              >
                {product.quantity}
              </TableCell>
              <TableCell className="text-right tabular-nums text-muted-foreground">
                {product.minQuantity}
              </TableCell>
              <TableCell>
                <Badge variant={product.active ? "success" : "secondary"}>
                  {product.active ? "Ativo" : "Inativo"}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {formatDate(product.createdAt)}
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
                    <DropdownMenuItem onClick={() => onEdit(product)}>
                      <Pencil />
                      Editar
                    </DropdownMenuItem>
                    {product.active ? (
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => onDeactivate(product)}
                      >
                        <Ban />
                        Inativar
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem onClick={() => onReactivate(product)}>
                        <RotateCcw />
                        Reativar
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
