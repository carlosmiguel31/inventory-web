import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
  MOVEMENT_TYPE_LABELS,
  movementDirection,
  type MovementDirection,
} from "../stock.constants";
import type { StockMovement } from "../stock.types";
import { formatDateTime } from "../stock.utils";

interface StockMovementsTableProps {
  movements: StockMovement[];
  productMap: Map<string, { name: string; sku: string }>;
  userMap: Map<string, string>;
}

const BADGE_VARIANT: Record<
  MovementDirection,
  "success" | "destructive" | "warning" | "secondary"
> = {
  entry: "success",
  output: "destructive",
  adjustment: "warning",
  transfer: "secondary",
};

function QuantityCell({ movement }: { movement: StockMovement }) {
  const dir = movementDirection(movement.type);
  if (dir === "adjustment") {
    return (
      <span className="tabular-nums text-warning">
        → {movement.newQuantity ?? "—"}
      </span>
    );
  }
  const sign = dir === "entry" ? "+" : dir === "output" ? "−" : "";
  return (
    <span
      className={cn(
        "tabular-nums",
        dir === "entry" && "text-success",
        dir === "output" && "text-destructive",
      )}
    >
      {sign}
      {movement.quantity ?? "—"}
    </span>
  );
}

export function StockMovementsTable({
  movements,
  productMap,
  userMap,
}: StockMovementsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead>Data</TableHead>
          <TableHead>Produto</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead className="text-right">Quantidade</TableHead>
          <TableHead>Responsável</TableHead>
          <TableHead>Usuário</TableHead>
          <TableHead>Observação</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {movements.map((m) => {
          const product = m.product ?? productMap.get(m.productId);
          const userName = m.user?.name ?? (m.userId ? userMap.get(m.userId) : undefined);
          return (
            <TableRow key={m.id}>
              <TableCell className="whitespace-nowrap text-muted-foreground">
                {formatDateTime(m.createdAt)}
              </TableCell>
              <TableCell>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {product?.name ?? "—"}
                  </p>
                  {product?.sku && (
                    <p className="font-mono text-xs text-muted-foreground">
                      {product.sku}
                    </p>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={BADGE_VARIANT[movementDirection(m.type)]}>
                  {MOVEMENT_TYPE_LABELS[m.type]}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <QuantityCell movement={m} />
              </TableCell>
              <TableCell className="text-muted-foreground">
                {m.counterpart || "—"}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {userName ?? "—"}
              </TableCell>
              <TableCell className="max-w-[220px] truncate text-muted-foreground">
                {m.note || "—"}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
