import { useState } from "react";
import { LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { SettingsSection } from "./SettingsSection";

export function SecuritySettings() {
  const { logout } = useAuth();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");

  return (
    <SettingsSection title="Segurança" description="Senha e sessão.">
      <div className="space-y-3">
        <p className="text-sm font-medium">Alterar senha</p>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="cur-pass">Senha atual</Label>
            <Input
              id="cur-pass"
              type="password"
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-pass">Nova senha</Label>
            <Input
              id="new-pass"
              type="password"
              value={next}
              onChange={(e) => setNext(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="conf-pass">Confirmar</Label>
            <Input
              id="conf-pass"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {/* TODO(backend): habilitar quando existir endpoint de troca de senha
              (ex.: PATCH /api/auth/password ou /api/users/:id/password). */}
          <Button type="button" disabled>
            Alterar senha
          </Button>
          <span className="text-xs text-muted-foreground">
            Disponível quando o endpoint de troca de senha existir.
          </span>
        </div>
      </div>

      <div className="border-t border-border pt-4">
        <p className="text-sm font-medium">Sessão</p>
        <p className="mb-3 text-sm text-muted-foreground">
          Encerre sua sessão neste dispositivo.
        </p>
        <Button type="button" variant="outline" onClick={logout}>
          <LogOut className="h-4 w-4" />
          Encerrar sessão
        </Button>
      </div>
    </SettingsSection>
  );
}
