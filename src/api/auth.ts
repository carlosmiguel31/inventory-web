import { api } from "@/lib/axios";
import type { LoginPayload, LoginResponse, User } from "@/types/auth";

/**
 * POST /api/auth/login
 *
 * Normaliza a resposta para a forma { token, user } que o front consome.
 * Aceita variações comuns de nome de campo do token (token / accessToken /
 * access_token) e também respostas envelopadas em `data`. Ajuste conforme o
 * contrato real do seu backend, se necessário.
 */
export async function loginRequest(
  payload: LoginPayload,
): Promise<LoginResponse> {
  const { data } = await api.post("/api/auth/login", payload);

  const token: string | undefined =
    data?.token ?? data?.accessToken ?? data?.access_token ?? data?.data?.token;
  const user: User | undefined = data?.user ?? data?.data?.user;

  if (!token || !user) {
    throw new Error("Resposta de login inválida do servidor.");
  }

  return { token, user };
}
