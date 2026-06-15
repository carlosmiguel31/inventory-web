import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { SettingsSection } from "./SettingsSection";

export function ProfileSettings() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");

  return (
    <SettingsSection
      title="Perfil do usuário"
      description="Seus dados de acesso ao sistema."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="profile-name">Nome</Label>
          <Input
            id="profile-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="profile-email">E-mail</Label>
          <Input
            id="profile-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* TODO(backend): habilitar quando existir endpoint de atualização de
            perfil (ex.: PATCH /api/users/:id do próprio usuário, ou /api/auth/me). */}
        <Button type="button" disabled>
          Salvar alterações
        </Button>
        <span className="text-xs text-muted-foreground">
          Edição disponível quando o endpoint de perfil for implementado.
        </span>
      </div>
    </SettingsSection>
  );
}
