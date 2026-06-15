import { APP_VERSION, getApiUrl, getEnvironmentLabel } from "../settings.constants";
import { SettingsSection } from "./SettingsSection";

export function SystemInfo() {
  const rows = [
    { label: "Versão do sistema", value: APP_VERSION },
    { label: "Ambiente", value: getEnvironmentLabel() },
    { label: "API URL", value: getApiUrl() },
  ];

  return (
    <SettingsSection
      title="Informações"
      description="Dados do ambiente atual da aplicação."
    >
      <dl className="divide-y divide-border">
        {rows.map((r) => (
          <div
            key={r.label}
            className="flex items-center justify-between gap-4 py-2.5"
          >
            <dt className="text-sm text-muted-foreground">{r.label}</dt>
            <dd className="truncate font-mono text-sm">{r.value}</dd>
          </div>
        ))}
      </dl>
    </SettingsSection>
  );
}
