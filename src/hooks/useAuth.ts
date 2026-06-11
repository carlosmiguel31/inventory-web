import { useContext } from "react";

import { AuthContext } from "@/contexts/auth.context";

/** Acessa o contexto de autenticação. Deve estar sob <AuthProvider>. */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth deve ser usado dentro de <AuthProvider>.");
  }
  return ctx;
}
