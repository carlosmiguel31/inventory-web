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

/**
 * Inativação: endpoint dedicado PATCH /api/categories/:id/deactivate.
 */
export function useDeactivateCategory() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: (id: string) => categoriesService.deactivate(id),
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

/** Reativação: endpoint dedicado PATCH /api/categories/:id/activate. */
export function useReactivateCategory() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: (id: string) => categoriesService.activate(id),
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
