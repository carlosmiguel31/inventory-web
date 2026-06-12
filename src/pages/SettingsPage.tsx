import { ModulePlaceholder } from "@/components/states";

export default function SettingsPage() {
  return (
    <ModulePlaceholder
      title="Configurações"
      description="Preferências da conta e do sistema."
      breadcrumb={[{ label: "Início", to: "/" }, { label: "Configurações" }]}
    />
  );
}
