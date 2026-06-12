import { ModulePlaceholder } from "@/components/states";

export default function CategoriesPage() {
  return (
    <ModulePlaceholder
      title="Categorias"
      description="Organização dos produtos por categoria."
      breadcrumb={[{ label: "Início", to: "/" }, { label: "Categorias" }]}
    />
  );
}
