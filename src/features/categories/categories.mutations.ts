import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useToast } from "@/hooks/useToast";
import { queryKeys } from "@/lib/query-keys";
import { categoriesService } from "./categories.service";
import type { CreateCategoryDTO, UpdateCategoryDTO } from "./categories.types";

export function useCreateCategory() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: (payload: CreateCategoryDTO) => categoriesService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.lists() });
      toast({
        title: "Categoria criada",
        description: "A categoria foi cadastrada com sucesso.",
        variant: "success",
      });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateCategoryDTO }) =>
      categoriesService.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.lists() });
      toast({
        title: "Categoria atualizada",
        description: "As alterações foram salvas.",
        variant: "success",
      });
    },
  });
}

/** Inativação lógica: DELETE /api/categories/:id. */
export function useDeleteCategory() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: (id: string) => categoriesService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.lists() });
      toast({
        title: "Categoria inativada",
        description: "A categoria foi inativada com sucesso.",
        variant: "success",
      });
    },
  });
}

/** Reativação via PATCH { active: true }. */
export function useReactivateCategory() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: (id: string) => categoriesService.update(id, { active: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.lists() });
      toast({
        title: "Categoria reativada",
        description: "A categoria está ativa novamente.",
        variant: "success",
      });
    },
  });
}
