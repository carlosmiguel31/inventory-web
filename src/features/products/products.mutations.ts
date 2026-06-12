import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useToast } from "@/hooks/useToast";
import { queryKeys } from "@/lib/query-keys";
import { productsService } from "./products.service";
import type { CreateProductDTO, UpdateProductDTO } from "./products.types";

/**
 * Mutations de produtos. Em caso de erro, o handler global do React Query
 * (lib/query-client.ts) já exibe um toast; aqui tratamos apenas o sucesso e a
 * invalidação do cache de listagem.
 */
export function useCreateProduct() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (payload: CreateProductDTO) => productsService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.lists() });
      toast({
        title: "Produto criado",
        description: "O produto foi cadastrado com sucesso.",
        variant: "success",
      });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateProductDTO }) =>
      productsService.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.lists() });
      toast({
        title: "Produto atualizado",
        description: "As alterações foram salvas.",
        variant: "success",
      });
    },
  });
}

/** Inativação (exclusão lógica): o backend desativa o produto (DELETE /api/products/:id). */
export function useDeleteProduct() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => productsService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.lists() });
      toast({
        title: "Produto inativado",
        description: "O produto foi inativado com sucesso.",
        variant: "success",
      });
    },
  });
}

/**
 * Reativação: usa o endpoint de edição já existente
 * (PATCH /api/products/:id) enviando { active: true }. Não requer rota nova.
 */
export function useReactivateProduct() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => productsService.update(id, { active: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.lists() });
      toast({
        title: "Produto reativado",
        description: "O produto está ativo novamente.",
        variant: "success",
      });
    },
  });
}
