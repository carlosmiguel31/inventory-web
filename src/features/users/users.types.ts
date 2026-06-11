// O domínio "User" é único na aplicação: reaproveitamos a interface já usada
// pela autenticação como fonte única da verdade.
export type { User } from "@/types/auth";

export interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
  role?: string;
}

export type UpdateUserDTO = Partial<Omit<CreateUserDTO, "password">> & {
  password?: string;
};
