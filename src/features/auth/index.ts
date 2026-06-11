// Barrel da feature de auth: a implementação viva (AuthProvider, useAuth,
// storage) permanece intacta — aqui apenas expomos uma superfície consistente.
export { useAuth } from "@/hooks/useAuth";
export { authService } from "./auth.service";
export type { User, LoginPayload, LoginResponse, AuthContextValue } from "@/types/auth";
