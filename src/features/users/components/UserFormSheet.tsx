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
import { ROLE_OPTIONS } from "../users.constants";
import { useCreateUser, useUpdateUser } from "../users.mutations";
import type { User } from "../users.types";

interface UserFormSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Usuário em edição; ausente => criação. */
  user?: User | null;
}

interface FormState {
  name: string;
  email: string;
  password: string;
  role: string;
  active: boolean;
}

const EMPTY: FormState = {
  name: "",
  email: "",
  password: "",
  role: "OPERADOR",
  active: true,
};

export function UserFormSheet({ open, onOpenChange, user }: UserFormSheetProps) {
  const isEdit = Boolean(user);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [error, setError] = useState<string | null>(null);

  const createMutation = useCreateUser();
  const updateMutation = useUpdateUser();
  const submitting = createMutation.isPending || updateMutation.isPending;

  useEffect(() => {
    if (!open) return;
    setError(null);
    if (user) {
      setForm({
        name: user.name,
        email: user.email,
        password: "",
        role: user.role || "OPERADOR",
        active: user.active,
      });
    } else {
      setForm(EMPTY);
    }
  }, [open, user]);

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.name.trim()) {
      setError("Informe o nome.");
      return;
    }
    if (!form.email.trim()) {
      setError("Informe o e-mail.");
      return;
    }
    if (!isEdit && !form.password.trim()) {
      setError("Informe a senha.");
      return;
    }
    setError(null);

    try {
      if (user) {
        await updateMutation.mutateAsync({
          id: user.id,
          payload: {
            name: form.name.trim(),
            email: form.email.trim(),
            role: form.role,
            active: form.active,
          },
        });
      } else {
        await createMutation.mutateAsync({
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
          role: form.role,
        });
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
          <SheetTitle>{isEdit ? "Editar usuário" : "Novo usuário"}</SheetTitle>
          <SheetDescription>
            {isEdit
              ? "Atualize as informações do usuário."
              : "Preencha os dados para cadastrar um novo usuário."}
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
              required
            />
          </div>

          {!isEdit && (
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={form.password}
                onChange={(e) => setField("password", e.target.value)}
                required
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="role">Perfil</Label>
            <Select
              id="role"
              value={form.role}
              onChange={(e) => setField("role", e.target.value)}
            >
              {ROLE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </Select>
          </div>

          {isEdit && (
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                id="status"
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
