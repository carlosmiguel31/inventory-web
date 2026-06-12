import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useToast } from "@/hooks/useToast";
import { queryKeys } from "@/lib/query-keys";
import { stockService } from "./stock.service";
import type { CreateStockMovementInput } from "./stock.types";

export function useCreateStockMovement() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (input: CreateStockMovementInput) =>
      stockService.createMovement(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.stock.lists() });
      // A movimentação altera o estoque dos produtos.
      queryClient.invalidateQueries({ queryKey: queryKeys.products.lists() });
      toast({
        title: "Movimentação registrada",
        description: "A movimentação foi salva com sucesso.",
        variant: "success",
      });
    },
  });
}
