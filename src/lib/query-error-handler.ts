/**
 * Ponte desacoplada entre o React Query (criado fora da árvore React) e a UI
 * de toasts. O ToastProvider registra aqui o handler; o queryClient o aciona
 * em qualquer erro de query/mutation (ver lib/query-client.ts).
 */
type QueryErrorHandler = (error: unknown) => void;

let handler: QueryErrorHandler | null = null;

export function setQueryErrorHandler(fn: QueryErrorHandler | null) {
  handler = fn;
}

export function reportQueryError(error: unknown) {
  handler?.(error);
}
