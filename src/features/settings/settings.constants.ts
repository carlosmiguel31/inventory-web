// Informações do ambiente — todas disponíveis no cliente, sem backend.
// TODO(build): idealmente injetar a versão a partir do package.json via Vite
// `define` (ex.: __APP_VERSION__) para evitar divergência manual.
export const APP_VERSION = "0.1.0";

export function getEnvironmentLabel(): string {
  const mode = import.meta.env.MODE; // fornecido pelo Vite
  if (mode === "production") return "Produção";
  if (mode === "development") return "Desenvolvimento";
  return mode;
}

export function getApiUrl(): string {
  return import.meta.env.VITE_API_URL || "—";
}
