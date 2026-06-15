import axios from "axios";

interface ApiErrorData {
  message?: string | string[];
  error?: string;
  statusCode?: number;
  errors?: Record<string, string[]> | Array<{ field?: string; message?: string }>;
}

/**
 * Extrai a mensagem enviada pelo backend, lidando com os formatos comuns:
 * - `message` string
 * - `message` array (class-validator do NestJS)
 * - `errors` objeto (campo -> mensagens) ou lista de { message }
 * - `error` string
 */
function extractBackendMessage(data: ApiErrorData | undefined): string | null {
  if (!data) return null;

  if (Array.isArray(data.message)) {
    const joined = data.message.filter(Boolean).join(" • ");
    return joined || null;
  }
  if (typeof data.message === "string" && data.message.trim()) {
    return data.message.trim();
  }

  if (Array.isArray(data.errors)) {
    const msgs = data.errors
      .map((e) => e?.message)
      .filter((m): m is string => Boolean(m));
    if (msgs.length) return msgs.join(" • ");
  } else if (data.errors && typeof data.errors === "object") {
    const msgs = (Object.values(data.errors).flat() as unknown[]).filter(
      (m): m is string => typeof m === "string" && m.length > 0,
    );
    if (msgs.length) return msgs.join(" • ");
  }

  if (typeof data.error === "string" && data.error.trim()) {
    return data.error.trim();
  }
  return null;
}

/**
 * Mensagem "crua" do erro (backend → Error → fallback). NÃO mapeia por status —
 * usada em contextos já específicos, como a tela de login (erro inline).
 */
export function getErrorMessage(
  error: unknown,
  fallback = "Algo deu errado. Tente novamente.",
): string {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return "Não foi possível conectar ao servidor. Verifique sua conexão.";
    }
    const data = error.response.data as ApiErrorData | undefined;
    return extractBackendMessage(data) ?? error.message ?? fallback;
  }
  if (error instanceof Error) return error.message;
  return fallback;
}

/**
 * Mensagem amigável padronizada por status HTTP — usada no TOAST GLOBAL de
 * erros da API. Prioriza a mensagem do backend em conflitos/validações.
 */
export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    // Sem resposta = rede/timeout/CORS.
    if (!error.response) {
      return "Não foi possível conectar ao servidor. Verifique sua conexão.";
    }

    const status = error.response.status;
    const data = error.response.data as ApiErrorData | undefined;
    const backendMessage = extractBackendMessage(data);

    switch (status) {
      case 401:
        return "Sessão expirada. Faça login novamente.";
      case 403:
        return "Você não tem permissão para realizar esta ação.";
      case 404:
        return "Recurso não encontrado.";
      case 409:
        // Conflito (ex.: SKU duplicado) — priorizar a mensagem do backend.
        return backendMessage ?? "Conflito: o registro já existe ou está em uso.";
      case 422:
        // Erros de validação — exibir o que o backend retornou, de forma amigável.
        return backendMessage ?? "Verifique os dados informados e tente novamente.";
      default:
        if (status >= 500) {
          return "Erro interno. Tente novamente mais tarde.";
        }
        // 400 e demais 4xx: usar a mensagem do backend quando existir.
        return backendMessage ?? "Não foi possível concluir a solicitação.";
    }
  }
  if (error instanceof Error) return error.message;
  return "Algo deu errado. Tente novamente.";
}
