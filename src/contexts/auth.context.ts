import { createContext } from "react";

import type { AuthContextValue } from "@/types/auth";

/**
 * Contexto de autenticação. Fica em arquivo próprio (sem componente) para que
 * o Fast Refresh do Vite funcione bem e o ESLint (react-refresh) não reclame.
 * Consumir sempre via o hook `useAuth`.
 */
export const AuthContext = createContext<AuthContextValue | null>(null);
