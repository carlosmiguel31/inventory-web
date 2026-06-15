import { useState } from "react";
import { Image as ImageIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { SettingsSection } from "./SettingsSection";

export function SystemSettings() {
  const [company, setCompany] = useState("");

  return (
    <SettingsSection
      title="Sistema"
      description="Identidade e preferências gerais do sistema."
    >
      <div className="space-y-2">
        <Label htmlFor="company">Nome da empresa</Label>
        <Input
          id="company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          placeholder="Sua empresa"
        />
      </div>

      <div className="space-y-2">
        <Label>Logo</Label>
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-lg border border-dashed border-border bg-muted/40">
            <ImageIcon className="h-6 w-6 text-muted-foreground" />
          </div>
          {/* TODO(backend): upload de logo quando houver endpoint de mídia/config. */}
          <Button type="button" variant="outline" disabled>
            Enviar logo
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="theme">Tema</Label>
        <Select id="theme" defaultValue="dark" disabled>
          <option value="dark">Escuro</option>
          <option value="light">Claro</option>
          <option value="system">Sistema</option>
        </Select>
        <p className="text-xs text-muted-foreground">
          Personalização de tema em breve.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* TODO(backend): persistir nome/logo/tema quando houver endpoint
            (ex.: GET/PUT /api/settings). */}
        <Button type="button" disabled>
          Salvar
        </Button>
        <span className="text-xs text-muted-foreground">
          Estrutura preparada; persistência depende do backend.
        </span>
      </div>
    </SettingsSection>
  );
}
