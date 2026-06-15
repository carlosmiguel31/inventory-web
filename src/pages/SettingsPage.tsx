import { Breadcrumb } from "@/components/ui/breadcrumb";
import {
  ProfileSettings,
  SecuritySettings,
  SystemInfo,
  SystemSettings,
} from "@/features/settings";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Breadcrumb
          items={[{ label: "Início", to: "/" }, { label: "Configurações" }]}
        />
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Configurações</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Preferências da conta e do sistema.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ProfileSettings />
        <SecuritySettings />
        <SystemSettings />
        <SystemInfo />
      </div>
    </div>
  );
}
