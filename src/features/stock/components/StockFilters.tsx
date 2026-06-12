import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import type { Product } from "@/features/products";
import type { User } from "@/features/users";
import { MOVEMENT_TYPE_OPTIONS } from "../stock.constants";

interface StockFiltersProps {
  productId: string;
  onProductChange: (v: string) => void;
  type: string;
  onTypeChange: (v: string) => void;
  userId: string;
  onUserChange: (v: string) => void;
  startDate: string;
  onStartDateChange: (v: string) => void;
  endDate: string;
  onEndDateChange: (v: string) => void;
  products: Product[];
  users: User[];
}

export function StockFilters({
  productId,
  onProductChange,
  type,
  onTypeChange,
  userId,
  onUserChange,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
  products,
  users,
}: StockFiltersProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground">Produto</Label>
        <Select
          value={productId}
          onChange={(e) => onProductChange(e.target.value)}
          aria-label="Filtrar por produto"
        >
          <option value="">Todos os produtos</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground">Tipo</Label>
        <Select
          value={type}
          onChange={(e) => onTypeChange(e.target.value)}
          aria-label="Filtrar por tipo"
        >
          <option value="">Todos os tipos</option>
          {MOVEMENT_TYPE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground">Usuário</Label>
        <Select
          value={userId}
          onChange={(e) => onUserChange(e.target.value)}
          aria-label="Filtrar por usuário"
        >
          <option value="">Todos os usuários</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name}
            </option>
          ))}
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground">De</Label>
        <Input
          type="date"
          value={startDate}
          onChange={(e) => onStartDateChange(e.target.value)}
          aria-label="Data inicial"
        />
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground">Até</Label>
        <Input
          type="date"
          value={endDate}
          onChange={(e) => onEndDateChange(e.target.value)}
          aria-label="Data final"
        />
      </div>
    </div>
  );
}
