import type { UserRole } from "./users.types";

export const ROLE_LABELS: Record<string, string> = {
  ADMIN: "Administrador",
  GERENTE: "Gerente",
  OPERADOR: "Operador",
  ALMOXARIFADO: "Almoxarifado",
};

export const ROLE_OPTIONS: { value: UserRole; label: string }[] = [
  { value: "ADMIN", label: ROLE_LABELS.ADMIN },
  { value: "GERENTE", label: ROLE_LABELS.GERENTE },
  { value: "OPERADOR", label: ROLE_LABELS.OPERADOR },
  { value: "ALMOXARIFADO", label: ROLE_LABELS.ALMOXARIFADO },
];

export function roleLabel(role?: string | null): string {
  if (!role) return "—";
  return ROLE_LABELS[role] ?? role;
}

/**
 * Gate de UX para ocultar ações de gestão de usuários.
 * OPERADOR e ALMOXARIFADO não gerenciam; ADMIN e GERENTE sim.
 * Perfil ausente NÃO bloqueia (evita travar a tela se o backend não retornar o
 * role no usuário logado). A segurança real é responsabilidade do backend.
 */
const NON_MANAGER_ROLES = ["OPERADOR", "ALMOXARIFADO"];

export function canManageUsers(role?: string | null): boolean {
  if (!role) return true;
  return !NON_MANAGER_ROLES.includes(role);
}
