import { ModulePlaceholder } from "@/components/states";

export default function ReportsPage() {
  return (
    <ModulePlaceholder
      title="Relatórios"
      description="Indicadores e relatórios do estoque."
      breadcrumb={[{ label: "Início", to: "/" }, { label: "Relatórios" }]}
    />
  );
}
