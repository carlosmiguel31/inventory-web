import { useCallback, useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

import { loginRequest } from "@/api/auth";
import { setUnauthorizedHandler } from "@/lib/axios";
import { authStorage } from "@/services/storage";
import type { LoginPayload, User } from "@/types/auth";

import { AuthContext } from "./auth.context";

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  // Começa carregando: precisamos restaurar a sessão antes de decidir rotas.
  const [loading, setLoading] = useState(true);

  // 1) Restauração da sessão ao montar / recarregar a página.
  useEffect(() => {
    const storedToken = authStorage.getToken();
    const storedUser = authStorage.getUser();
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  // Limpa sessão (storage + estado + cache do React Query).
  const clearSession = useCallback(() => {
    authStorage.clear();
    setToken(null);
    setUser(null);
    queryClient.clear();
  }, [queryClient]);

  const login = useCallback(
    async (payload: LoginPayload) => {
      const { token: newToken, user: newUser } = await loginRequest(payload);
      authStorage.setSession(newToken, newUser);
      setToken(newToken);
      setUser(newUser);
      navigate("/", { replace: true });
    },
    [navigate],
  );

  const logout = useCallback(() => {
    clearSession();
    navigate("/login", { replace: true });
  }, [clearSession, navigate]);

  // 2) 401 vindo do interceptor do Axios -> encerra sessão e vai ao login.
  useEffect(() => {
    setUnauthorizedHandler(() => {
      clearSession();
      navigate("/login", { replace: true });
    });
    return () => setUnauthorizedHandler(null);
  }, [clearSession, navigate]);

  // 3) Sincronização entre abas: reage a mudanças no storage feitas por outra aba.
  useEffect(() => {
    function handleStorage(event: StorageEvent) {
      if (event.key !== authStorage.TOKEN_KEY) return;
      if (!event.newValue) {
        // Logout em outra aba.
        setToken(null);
        setUser(null);
        queryClient.clear();
      } else {
        // Login (ou troca de conta) em outra aba.
        setToken(event.newValue);
        setUser(authStorage.getUser());
      }
    }
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [queryClient]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(token),
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
