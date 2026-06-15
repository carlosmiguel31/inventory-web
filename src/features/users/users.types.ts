import type { ID, Timestamps } from "@/types/common";

export type UserRole = "ADMIN" | "GERENTE" | "OPERADOR" | "ALMOXARIFADO";

export interface User extends Timestamps {
  id: ID;
  name: string;
  email: string;
  /** Valores esperados em UserRole; mantido string para tolerar outros perfis. */
  role: string;
  active: boolean;
}

export interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
  role: string;
}

export interface UpdateUserDTO {
  name?: string;
  email?: string;
  role?: string;
  active?: boolean;
}
