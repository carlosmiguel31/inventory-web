import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useToast } from "@/hooks/useToast";
import { queryKeys } from "@/lib/query-keys";
import { usersService } from "./users.service";
import type { CreateUserDTO, UpdateUserDTO } from "./users.types";

export function useCreateUser() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: (payload: CreateUserDTO) => usersService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() });
      toast({
        title: "Usuário criado",
        description: "O usuário foi cadastrado com sucesso.",
        variant: "success",
      });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateUserDTO }) =>
      usersService.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() });
      toast({
        title: "Usuário atualizado",
        description: "As alterações foram salvas.",
        variant: "success",
      });
    },
  });
}

/** Inativação reutiliza o endpoint de edição (PATCH /api/users/:id { active:false }). */
export function useDeactivateUser() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: (id: string) => usersService.update(id, { active: false }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() });
      toast({
        title: "Usuário inativado",
        description: "O usuário foi inativado com sucesso.",
        variant: "success",
      });
    },
  });
}

/** Reativação via o mesmo endpoint de edição ({ active: true }). */
export function useReactivateUser() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: (id: string) => usersService.update(id, { active: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() });
      toast({
        title: "Usuário reativado",
        description: "O usuário está ativo novamente.",
        variant: "success",
      });
    },
  });
}
