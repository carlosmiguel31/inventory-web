/**
 * Tipos do domínio de autenticação.
 *
 * `User` é propositalmente flexível (index signature) para acomodar campos
 * extras que o backend possa retornar sem quebrar a tipagem. Ajuste os campos
 * fixos conforme o payload real da sua API.
 */
export interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  [key: string]: unknown;
}

export interface LoginPayload {
  email: string;
  password: string;
}

/** Forma normalizada que o front consome internamente. */
export interface LoginResponse {
  token: string;
  user: User;
}

export interface AuthContextValue {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  /** `true` enquanto a sessão está sendo restaurada do storage. */
  loading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => void;
}
