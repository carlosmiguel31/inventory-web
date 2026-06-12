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

// TODO(backend): inativação/reativação de categorias está desabilitada porque o
// backend não possui a rota correspondente (retorna "Rota não encontrada").
// Quando o endpoint existir, recriar aqui useDeactivateCategory /
// useReactivateCategory chamando categoriesService e reativar os botões na UI
// (CategoriesTable e CategoryFormSheet) e o ConfirmDialog em CategoriesPage.
