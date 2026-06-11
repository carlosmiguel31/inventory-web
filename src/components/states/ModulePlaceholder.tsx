import { Construction } from "lucide-react";

import { EmptyState } from "./EmptyState";

/**
 * Página-base para módulos cuja infraestrutura já existe mas cujo CRUD ainda
 * não foi implementado. Usada pelas rotas lazy de produtos, estoque, etc.
 */
export function ModulePlaceholder({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      <EmptyState
        icon={Construction}
        title="Módulo em preparação"
        description="A infraestrutura está pronta. As funcionalidades deste módulo serão habilitadas em breve."
      />
    </div>
  );
}
