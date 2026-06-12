import { Construction } from "lucide-react";

import { Breadcrumb, type BreadcrumbItem } from "@/components/ui/breadcrumb";
import { EmptyState } from "./EmptyState";

/**
 * Página-base de um módulo: breadcrumb + título + descrição + estado inicial.
 * Usada enquanto o CRUD do módulo ainda não foi implementado.
 */
export function ModulePlaceholder({
  title,
  description,
  breadcrumb,
}: {
  title: string;
  description?: string;
  breadcrumb?: BreadcrumbItem[];
}) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        {breadcrumb && breadcrumb.length > 0 && <Breadcrumb items={breadcrumb} />}
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          {description && (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
      <EmptyState
        icon={Construction}
        title="Módulo em preparação"
        description="A navegação e a infraestrutura estão prontas. As funcionalidades deste módulo serão habilitadas em breve."
      />
    </div>
  );
}
