import {
  MutationCache,
  QueryCache,
  QueryClient,
} from "@tanstack/react-query";

import { reportQueryError } from "./query-error-handler";

/**
 * Configuração global do React Query.
 * - Cache padrão (staleTime/gcTime) e retry conservador.
 * - Tratamento de erros centralizado: qualquer query/mutation que falhar
 *   dispara o handler global (ligado a um toast pelo ToastProvider).
 */
export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => reportQueryError(error),
  }),
  mutationCache: new MutationCache({
    onError: (error) => reportQueryError(error),
  }),
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 min
      gcTime: 1000 * 60 * 5, // 5 min
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});
