import axios, { AxiosError } from "axios";

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

/* ------------------------------------------------------------------ *
 * Toast global de erros da API.
 * O ToastProvider registra aqui a função que exibe o toast, para que o
 * interceptor (que vive fora da árvore React) consiga notificar o usuário
 * sobre QUALQUER erro de resposta — inclusive os que chegam com HTTP 2xx
 * mas com envelope de erro { status: "error", message }.
 * ------------------------------------------------------------------ */
type ApiErrorToast = (error: unknown) => void;
let apiErrorToast: ApiErrorToast | null = null;

export function setApiErrorToast(fn: ApiErrorToast | null) {
  apiErrorToast = fn;
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
  (response) => {
    // Alguns erros de negócio chegam com HTTP 2xx, mas com envelope de erro:
    // { status: "error", message: "..." }. O Axios não trata 2xx como erro,
    // então convertemos manualmente em rejeição e disparamos o toast.
    const data = response.data as
      | { status?: string; message?: string; error?: string }
      | undefined;
    if (data && typeof data === "object" && data.status === "error") {
      const message =
        data.message ?? data.error ?? "Erro retornado pela API.";
      const enveloped = new AxiosError(
        message,
        "ERR_API_ERROR_ENVELOPE",
        response.config,
        response.request,
        response,
      );
      apiErrorToast?.(enveloped);
      return Promise.reject(enveloped);
    }
    return response;
  },
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      // Token inválido/expirado: encerra a sessão de forma centralizada.
      unauthorizedHandler?.();
    }
    // Toast global para todo erro de resposta (4xx/5xx, timeout, rede).
    apiErrorToast?.(error);
    return Promise.reject(error);
  },
);

export default api;
