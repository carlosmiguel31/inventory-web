import { ModulePlaceholder } from "@/components/states";

export default function UsersPage() {
  return (
    <ModulePlaceholder
      title="Usuários"
      description="Gestão de usuários e permissões."
      breadcrumb={[{ label: "Início", to: "/" }, { label: "Usuários" }]}
    />
  );
}
