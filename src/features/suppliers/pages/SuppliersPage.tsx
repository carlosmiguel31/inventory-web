import { ModulePlaceholder } from "@/components/states";

export default function SuppliersPage() {
  return (
    <ModulePlaceholder
      title="Fornecedores"
      description="Cadastro e gestão de fornecedores."
      breadcrumb={[{ label: "Início", to: "/" }, { label: "Fornecedores" }]}
    />
  );
}
