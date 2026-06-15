import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { LowStockItem } from "../reports.types";

export function LowStockTable({ items }: { items: LowStockItem[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead>Produto</TableHead>
          <TableHead>SKU</TableHead>
          <TableHead>Estoque Atual</TableHead>
          <TableHead>Estoque Mínimo</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="font-medium">{item.name}</TableCell>
            <TableCell className="font-mono text-xs text-muted-foreground">
              {item.sku || "—"}
            </TableCell>
            <TableCell>
              <Badge variant={item.quantity === 0 ? "destructive" : "warning"}>
                {item.quantity}
              </Badge>
            </TableCell>
            <TableCell className="text-muted-foreground">
              {item.minQuantity}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
