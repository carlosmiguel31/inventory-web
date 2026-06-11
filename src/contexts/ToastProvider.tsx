import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { CheckCircle2, Info, TriangleAlert, X } from "lucide-react";

import { setQueryErrorHandler } from "@/lib/query-error-handler";
import { cn } from "@/lib/utils";
import { getErrorMessage } from "@/utils/errors";
import {
  ToastContext,
  type ToastInput,
  type ToastItem,
  type ToastVariant,
} from "./toast.context";

const VARIANT_BORDER: Record<ToastVariant, string> = {
  default: "border-border",
  success: "border-success/40",
  error: "border-destructive/40",
};

const VARIANT_ICON: Record<ToastVariant, typeof Info> = {
  default: Info,
  success: CheckCircle2,
  error: TriangleAlert,
};

const VARIANT_ICON_COLOR: Record<ToastVariant, string> = {
  default: "text-muted-foreground",
  success: "text-success",
  error: "text-destructive",
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timers = useRef<Record<string, number>>({});

  const dismiss = useCallback((id: string) => {
    setToasts((current) => current.filter((t) => t.id !== id));
    const handle = timers.current[id];
    if (handle) {
      window.clearTimeout(handle);
      delete timers.current[id];
    }
  }, []);

  const toast = useCallback(
    (input: ToastInput) => {
      const id = crypto.randomUUID();
      setToasts((current) => [
        ...current,
        {
          id,
          title: input.title,
          description: input.description,
          variant: input.variant ?? "default",
        },
      ]);
      timers.current[id] = window.setTimeout(
        () => dismiss(id),
        input.duration ?? 4500,
      );
      return id;
    },
    [dismiss],
  );

  // Liga os erros do React Query a um toast global.
  useEffect(() => {
    setQueryErrorHandler((error) =>
      toast({ title: "Erro", description: getErrorMessage(error), variant: "error" }),
    );
    return () => setQueryErrorHandler(null);
  }, [toast]);

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-2">
        {toasts.map((t) => {
          const Icon = VARIANT_ICON[t.variant];
          return (
            <div
              key={t.id}
              role="status"
              className={cn(
                "pointer-events-auto flex items-start gap-3 rounded-lg border bg-card p-4 shadow-lg animate-fade-in",
                VARIANT_BORDER[t.variant],
              )}
            >
              <Icon
                className={cn("mt-0.5 h-4 w-4 shrink-0", VARIANT_ICON_COLOR[t.variant])}
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{t.title}</p>
                {t.description && (
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {t.description}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => dismiss(t.id)}
                aria-label="Fechar"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
