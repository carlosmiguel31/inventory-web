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
 * Inativação (soft delete): marca a categoria como inativa via
 * PATCH /api/categories/:id { active: false }. O registro permanece e passa a
 * aparecer no filtro "Inativas" (DELETE removeria o registro definitivamente).
 */
export function useDeactivateCategory() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: (id: string) => categoriesService.update(id, { active: false }),
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
