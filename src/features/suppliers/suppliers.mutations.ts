import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useToast } from "@/hooks/useToast";
import { queryKeys } from "@/lib/query-keys";
import { suppliersService } from "./suppliers.service";
import type { CreateSupplierDTO, UpdateSupplierDTO } from "./suppliers.types";

export function useCreateSupplier() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: (payload: CreateSupplierDTO) => suppliersService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.suppliers.lists() });
      toast({
        title: "Fornecedor criado",
        description: "O fornecedor foi cadastrado com sucesso.",
        variant: "success",
      });
    },
  });
}

export function useUpdateSupplier() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateSupplierDTO }) =>
      suppliersService.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.suppliers.lists() });
      toast({
        title: "Fornecedor atualizado",
        description: "As alterações foram salvas.",
        variant: "success",
      });
    },
  });
}

// TODO(backend): inativação/exclusão de fornecedores não tem endpoint
// confirmado no backend. Quando existir, adicionar aqui useDeactivateSupplier
// (ou useDeleteSupplier) chamando suppliersService e reativar a ação na UI
// (SuppliersTable) + ConfirmDialog na página.
