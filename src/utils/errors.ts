import axios from "axios";

/**
 * Extrai uma mensagem legível de qualquer erro (Axios, Error ou desconhecido).
 * Tenta os campos mais comuns retornados por APIs Express (`message`/`error`).
 */
export function getErrorMessage(
  error: unknown,
  fallback = "Algo deu errado. Tente novamente.",
): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as
      | { message?: string; error?: string }
      | undefined;
    return data?.message ?? data?.error ?? error.message ?? fallback;
  }
  if (error instanceof Error) return error.message;
  return fallback;
}
