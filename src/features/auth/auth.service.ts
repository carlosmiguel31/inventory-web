import { loginRequest } from "@/api/auth";
import { api } from "@/lib/axios";
import type { User } from "@/types/auth";

/**
 * Serviço de autenticação. Reaproveita o `loginRequest` já existente
 * (api/auth.ts) e adiciona endpoints auxiliares para uso futuro.
 */
export const authService = {
  login: loginRequest,
  me: async (): Promise<User> => {
    const { data } = await api.get<User>("/api/auth/me");
    return data;
  },
};
