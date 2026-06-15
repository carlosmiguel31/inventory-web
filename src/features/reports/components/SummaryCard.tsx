import type { LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface SummaryCardProps {
  label: string;
  value: number | null;
  icon: LucideIcon;
  loading?: boolean;
  /** Realça o número (ex.: estoque baixo). */
  highlight?: boolean;
}

export function SummaryCard({
  label,
  value,
  icon: Icon,
  loading,
  highlight,
}: SummaryCardProps) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
          <Icon className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm text-muted-foreground">{label}</p>
          {loading ? (
            <Skeleton className="mt-1 h-7 w-12" />
          ) : value === null ? (
            <p className="mt-1 text-sm text-muted-foreground">Indisponível</p>
          ) : (
            <p
              className={cn(
                "text-2xl font-semibold",
                highlight && value > 0 && "text-destructive",
              )}
            >
              {value}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
