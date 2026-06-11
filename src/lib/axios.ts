import axios from "axios";

import { authStorage } from "@/services/storage";

/**
 * Instância central do Axios.
 *
 * - Base URL vem de VITE_API_URL (ver .env.example).
 * - Timeout global para evitar requisições penduradas.
 * - Request interceptor injeta o JWT (Bearer) quando há sessão.
 * - Response interceptor centraliza o tratamento de erro e dispara o handler
 *   de "não autorizado" (401) — registrado pelo AuthProvider para encerrar a
 *   sessão e redirecionar ao login.
 */
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3000",
  timeout: 15_000,
  headers: {
    "Content-Type": "application/json",
  },
});

/* ------------------------------------------------------------------ *
 * Handler de 401 desacoplado do React Router.
 * Como o Axios vive fora da árvore de componentes, o AuthProvider
 * registra aqui a função que faz logout + navegação via SPA.
 * ------------------------------------------------------------------ */
type UnauthorizedHandler = () => void;
let unauthorizedHandler: UnauthorizedHandler | null = null;

export function setUnauthorizedHandler(handler: UnauthorizedHandler | null) {
  unauthorizedHandler = handler;
}

// Injeta o token em toda requisição autenticada.
api.interceptors.request.use((config) => {
  const token = authStorage.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Tratamento global de erros.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      // Token inválido/expirado: encerra a sessão de forma centralizada.
      unauthorizedHandler?.();
    }
    return Promise.reject(error);
  },
);

export default api;
