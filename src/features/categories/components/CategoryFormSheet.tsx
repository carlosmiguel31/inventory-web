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
import { useCreateCategory, useUpdateCategory } from "../categories.mutations";
import type { Category } from "../categories.types";

interface CategoryFormSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Categoria em edição; ausente => criação. */
  category?: Category | null;
  // TODO(backend): reintroduzir ações de Inativar/Reativar aqui quando o
  // backend expuser o endpoint de status.
}

interface FormState {
  name: string;
  code: string;
  active: boolean;
}

const EMPTY: FormState = { name: "", code: "", active: true };

export function CategoryFormSheet({
  open,
  onOpenChange,
  category,
}: CategoryFormSheetProps) {
  const isEdit = Boolean(category);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [error, setError] = useState<string | null>(null);

  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const submitting = createMutation.isPending || updateMutation.isPending;

  useEffect(() => {
    if (!open) return;
    setError(null);
    if (category) {
      setForm({
        name: category.name,
        code: category.code ?? "",
        active: category.active,
      });
    } else {
      setForm(EMPTY);
    }
  }, [open, category]);

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.name.trim()) {
      setError("Informe o nome da categoria.");
      return;
    }
    setError(null);

    const name = form.name.trim();
    const code = form.code.trim() || undefined;

    try {
      if (category) {
        await updateMutation.mutateAsync({ id: category.id, payload: { name, code } });
      } else {
        await createMutation.mutateAsync({ name, code, active: form.active });
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
            {isEdit ? "Editar categoria" : "Nova categoria"}
          </SheetTitle>
          <SheetDescription>
            {isEdit
              ? "Atualize as informações da categoria."
              : "Preencha os dados para cadastrar uma nova categoria."}
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
            <Label htmlFor="code">Código (opcional)</Label>
            <Input
              id="code"
              value={form.code}
              onChange={(e) => setField("code", e.target.value)}
              placeholder="Ex.: ELE, FER..."
            />
          </div>

          {/* Status só no cadastro: alteração de status (inativar/reativar)
              depende de endpoint do backend ainda inexistente. */}
          {!isEdit && (
            <div className="space-y-2">
              <Label htmlFor="active">Status</Label>
              <Select
                id="active"
                value={form.active ? "true" : "false"}
                onChange={(e) => setField("active", e.target.value === "true")}
              >
                <option value="true">Ativo</option>
                <option value="false">Inativo</option>
              </Select>
            </div>
          )}

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
