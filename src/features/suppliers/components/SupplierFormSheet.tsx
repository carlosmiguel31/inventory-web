import { useEffect, useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useCreateSupplier, useUpdateSupplier } from "../suppliers.mutations";
import type { Supplier } from "../suppliers.types";

interface SupplierFormSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Fornecedor em edição; ausente => criação. */
  supplier?: Supplier | null;
}

interface FormState {
  name: string;
  email: string;
  phone: string;
  document: string;
  address: string;
}

const EMPTY: FormState = {
  name: "",
  email: "",
  phone: "",
  document: "",
  address: "",
};

export function SupplierFormSheet({
  open,
  onOpenChange,
  supplier,
}: SupplierFormSheetProps) {
  const isEdit = Boolean(supplier);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [error, setError] = useState<string | null>(null);

  const createMutation = useCreateSupplier();
  const updateMutation = useUpdateSupplier();
  const submitting = createMutation.isPending || updateMutation.isPending;

  useEffect(() => {
    if (!open) return;
    setError(null);
    if (supplier) {
      setForm({
        name: supplier.name,
        email: supplier.email ?? "",
        phone: supplier.phone ?? "",
        document: supplier.document ?? "",
        address: supplier.address ?? "",
      });
    } else {
      setForm(EMPTY);
    }
  }, [open, supplier]);

  function setField<K extends keyof FormState>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.name.trim()) {
      setError("Informe o nome do fornecedor.");
      return;
    }
    setError(null);

    const payload = {
      name: form.name.trim(),
      email: form.email.trim() || undefined,
      phone: form.phone.trim() || undefined,
      document: form.document.trim() || undefined,
      address: form.address.trim() || undefined,
    };

    try {
      if (supplier) {
        await updateMutation.mutateAsync({ id: supplier.id, payload });
      } else {
        await createMutation.mutateAsync(payload);
      }
      onOpenChange(false);
    } catch {
      // erro já exibido via toast global; mantém o painel aberto para nova tentativa
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>
            {isEdit ? "Editar fornecedor" : "Novo fornecedor"}
          </SheetTitle>
          <SheetDescription>
            {isEdit
              ? "Atualize as informações do fornecedor."
              : "Preencha os dados para cadastrar um novo fornecedor."}
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
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => setField("email", e.target.value)}
              placeholder="Opcional"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Telefone</Label>
            <Input
              id="phone"
              value={form.phone}
              onChange={(e) => setField("phone", e.target.value)}
              placeholder="Opcional"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="document">Documento (CNPJ/CPF)</Label>
            <Input
              id="document"
              value={form.document}
              onChange={(e) => setField("document", e.target.value)}
              placeholder="Opcional"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Endereço</Label>
            <Input
              id="address"
              value={form.address}
              onChange={(e) => setField("address", e.target.value)}
              placeholder="Opcional"
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

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
              {submitting
                ? "Salvando..."
                : isEdit
                  ? "Salvar alterações"
                  : "Cadastrar"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
