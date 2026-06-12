import { useMemo, useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Product } from "@/features/products";
import { MOVEMENT_TYPE_OPTIONS, requiresNote } from "../stock.constants";
import { useCreateStockMovement } from "../stock.mutations";
import type { CreateStockMovementInput, StockMovementType } from "../stock.types";

interface StockMovementFormProps {
  products: Product[];
  onSuccess: () => void;
  onCancel: () => void;
}

interface FormErrors {
  productId?: string;
  quantity?: string;
  newQuantity?: string;
  counterpart?: string;
  note?: string;
}

export function StockMovementForm({
  products,
  onSuccess,
  onCancel,
}: StockMovementFormProps) {
  const [productId, setProductId] = useState("");
  const [type, setType] = useState<StockMovementType>("PURCHASE_ENTRY");
  const [quantity, setQuantity] = useState("");
  const [newQuantity, setNewQuantity] = useState("");
  const [counterpart, setCounterpart] = useState("");
  const [note, setNote] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

  const createMutation = useCreateStockMovement();
  const isAdjustment = type === "ADJUSTMENT";
  const noteRequired = useMemo(() => requiresNote(type), [type]);

  function validate(): FormErrors {
    const next: FormErrors = {};
    if (!productId) next.productId = "Selecione um produto.";

    if (isAdjustment) {
      if (newQuantity === "" || Number(newQuantity) < 0 || Number.isNaN(Number(newQuantity))) {
        next.newQuantity = "Informe a nova quantidade.";
      }
    } else if (quantity === "" || Number(quantity) <= 0 || Number.isNaN(Number(quantity))) {
      next.quantity = "Informe uma quantidade válida.";
    }

    if (!counterpart.trim()) {
      next.counterpart = "Informe quem recebeu / devolveu / retirou.";
    }

    if (noteRequired && !note.trim()) {
      next.note = "Observação é obrigatória para este tipo de movimentação.";
    }
    return next;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validation = validate();
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;

    const input: CreateStockMovementInput = {
      productId,
      type,
      counterpart: counterpart.trim() || undefined,
      note: note.trim() || undefined,
      ...(isAdjustment
        ? { newQuantity: Number(newQuantity) }
        : { quantity: Number(quantity) }),
    };

    try {
      await createMutation.mutateAsync(input);
      onSuccess();
    } catch {
      // erro já exibido via toast global
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="productId">Produto</Label>
        <Select
          id="productId"
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
        >
          <option value="">Selecione um produto</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} ({p.sku})
            </option>
          ))}
        </Select>
        {errors.productId && (
          <p className="text-sm text-destructive">{errors.productId}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="type">Tipo de movimentação</Label>
        <Select
          id="type"
          value={type}
          onChange={(e) => setType(e.target.value as StockMovementType)}
        >
          {MOVEMENT_TYPE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </Select>
      </div>

      {isAdjustment ? (
        <div className="space-y-2">
          <Label htmlFor="newQuantity">Nova quantidade</Label>
          <Input
            id="newQuantity"
            type="number"
            min="0"
            step="1"
            value={newQuantity}
            onChange={(e) => setNewQuantity(e.target.value)}
          />
          {errors.newQuantity && (
            <p className="text-sm text-destructive">{errors.newQuantity}</p>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          <Label htmlFor="quantity">Quantidade</Label>
          <Input
            id="quantity"
            type="number"
            min="1"
            step="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
          {errors.quantity && (
            <p className="text-sm text-destructive">{errors.quantity}</p>
          )}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="counterpart">Quem recebeu / devolveu / retirou</Label>
        <Input
          id="counterpart"
          value={counterpart}
          onChange={(e) => setCounterpart(e.target.value)}
          placeholder="Nome de quem recebeu / devolveu / retirou"
        />
        {errors.counterpart && (
          <p className="text-sm text-destructive">{errors.counterpart}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="note">
          Observação{noteRequired ? "" : " (opcional)"}
        </Label>
        <Textarea
          id="note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder={noteRequired ? "Obrigatória para este tipo" : "Opcional"}
        />
        {errors.note && (
          <p className="text-sm text-destructive">{errors.note}</p>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          disabled={createMutation.isPending}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={createMutation.isPending}>
          {createMutation.isPending ? "Registrando..." : "Registrar movimentação"}
        </Button>
      </div>
    </form>
  );
}
