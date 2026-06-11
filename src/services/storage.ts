import type { User } from "@/types/auth";

/**
 * Camada de persistência da sessão.
 *
 * Usa localStorage para que a sessão sobreviva a recarregamentos e seja
 * compartilhada entre abas (o evento `storage` do navegador dispara em outras
 * abas quando estas chaves mudam — ver AuthProvider).
 */
const TOKEN_KEY = "inventory.token";
const USER_KEY = "inventory.user";

export const authStorage = {
  TOKEN_KEY,
  USER_KEY,

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  getUser(): User | null {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  },

  setSession(token: string, user: User): void {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  clear(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
};
