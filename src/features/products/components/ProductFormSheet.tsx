import { useEffect, useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import type { Category } from "@/features/categories";
import type { Supplier } from "@/features/suppliers";
import { useCreateProduct, useUpdateProduct } from "../products.mutations";
import type { Product } from "../products.types";

interface ProductFormSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Produto em edição; ausente => criação. */
  product?: Product | null;
  categories: Category[];
  suppliers: Supplier[];
}

interface FormState {
  name: string;
  sku: string;
  description: string;
  price: string;
  minQuantity: string;
  categoryId: string;
  supplierId: string;
}

const EMPTY: FormState = {
  name: "",
  sku: "",
  description: "",
  price: "",
  minQuantity: "",
  categoryId: "",
  supplierId: "",
};

export function ProductFormSheet({
  open,
  onOpenChange,
  product,
  categories,
  suppliers,
}: ProductFormSheetProps) {
  const isEdit = Boolean(product);
  const [form, setForm] = useState<FormState>(EMPTY);

  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const submitting = createMutation.isPending || updateMutation.isPending;

  // Sincroniza o formulário ao abrir / trocar de produto.
  useEffect(() => {
    if (!open) return;
    if (product) {
      setForm({
        name: product.name,
        sku: product.sku,
        description: product.description ?? "",
        price: String(product.price ?? ""),
        minQuantity: String(product.minQuantity ?? ""),
        categoryId: product.categoryId ?? "",
        supplierId: product.supplierId ?? "",
      });
    } else {
      setForm(EMPTY);
    }
  }, [open, product]);

  function setField<K extends keyof FormState>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const basePayload = {
      name: form.name.trim(),
      sku: form.sku.trim(),
      description: form.description.trim() || null,
      price: Number(form.price),
      minQuantity: Number(form.minQuantity),
      categoryId: form.categoryId || null,
      supplierId: form.supplierId || null,
    };

    try {
      if (product) {
        await updateMutation.mutateAsync({ id: product.id, payload: basePayload });
      } else {
        await createMutation.mutateAsync({
          ...basePayload,
          quantity: 0,
          active: true,
        });
      }
      onOpenChange(false);
    } catch {
      // Erro já exibido via toast global; mantém o painel aberto.
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{isEdit ? "Editar produto" : "Novo produto"}</SheetTitle>
          <SheetDescription>
            {isEdit
              ? "Atualize as informações do produto."
              : "Preencha os dados para cadastrar um novo produto."}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => setField("name", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sku">SKU</Label>
            <Input
              id="sku"
              value={form.sku}
              onChange={(e) => setField("sku", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={(e) => setField("description", e.target.value)}
              placeholder="Opcional"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Valor (R$)</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(e) => setField("price", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="minQuantity">Estoque mínimo</Label>
              <Input
                id="minQuantity"
                type="number"
                min="0"
                step="1"
                value={form.minQuantity}
                onChange={(e) => setField("minQuantity", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="categoryId">Categoria</Label>
            <Select
              id="categoryId"
              value={form.categoryId}
              onChange={(e) => setField("categoryId", e.target.value)}
            >
              <option value="">Sem categoria</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="supplierId">Fornecedor</Label>
            <Select
              id="supplierId"
              value={form.supplierId}
              onChange={(e) => setField("supplierId", e.target.value)}
            >
              <option value="">Sem fornecedor</option>
              {suppliers.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </Select>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={submitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Salvando..." : isEdit ? "Salvar alterações" : "Cadastrar"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
