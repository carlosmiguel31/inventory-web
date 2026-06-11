import {
  ArrowDownRight,
  ArrowUpRight,
  Boxes,
  CircleDollarSign,
  Package,
  Plus,
  TriangleAlert,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const stats = [
  {
    label: "Total de produtos",
    value: "1.284",
    delta: "+4,2%",
    up: true,
    icon: Package,
  },
  {
    label: "Valor em estoque",
    value: "R$ 482,9k",
    delta: "+1,8%",
    up: true,
    icon: CircleDollarSign,
  },
  {
    label: "Itens em baixa",
    value: "18",
    delta: "+3",
    up: false,
    icon: TriangleAlert,
  },
  {
    label: "SKUs ativos",
    value: "964",
    delta: "-0,5%",
    up: false,
    icon: Boxes,
  },
];

const lowStock = [
  { sku: "SKU-1042", name: "Teclado mecânico 75%", qty: 4, min: 10 },
  { sku: "SKU-0876", name: "Cabo USB-C 2m", qty: 7, min: 25 },
  { sku: "SKU-2310", name: 'Monitor 27" QHD', qty: 2, min: 6 },
  { sku: "SKU-0455", name: "Mousepad XL", qty: 9, min: 20 },
];

const activity = [
  { label: "Entrada de 120 un.", item: "Cabo HDMI 4K", time: "há 12 min", in: true },
  { label: "Saída de 8 un.", item: 'Monitor 27" QHD', time: "há 1 h", in: false },
  { label: "Entrada de 40 un.", item: "Teclado mecânico 75%", time: "há 3 h", in: true },
  { label: "Saída de 15 un.", item: "Mousepad XL", time: "há 5 h", in: false },
];

export function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Cabeçalho da página */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Visão geral do estoque — atualizado há instantes.
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4" />
          Novo produto
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, delta, up, icon: Icon }) => (
          <Card key={label}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{label}</p>
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-secondary/60 text-muted-foreground">
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-3 flex items-end justify-between">
                <span className="text-2xl font-semibold tabular-nums tracking-tight">
                  {value}
                </span>
                <span
                  className={
                    "flex items-center gap-0.5 text-xs font-medium tabular-nums " +
                    (up ? "text-success" : "text-destructive")
                  }
                >
                  {up ? (
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  ) : (
                    <ArrowDownRight className="h-3.5 w-3.5" />
                  )}
                  {delta}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Estoque baixo */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-base">Estoque baixo</CardTitle>
              <CardDescription>
                Itens abaixo do mínimo definido
              </CardDescription>
            </div>
            <Badge variant="warning">{lowStock.length} alertas</Badge>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {lowStock.map((p) => (
                <div
                  key={p.sku}
                  className="flex items-center justify-between px-6 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{p.name}</p>
                    <p className="font-mono text-xs text-muted-foreground">
                      {p.sku}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium tabular-nums">
                        {p.qty}{" "}
                        <span className="text-muted-foreground">
                          / {p.min}
                        </span>
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        em estoque / mínimo
                      </p>
                    </div>
                    <div className="h-9 w-1.5 overflow-hidden rounded-full bg-border">
                      <div
                        className="w-full rounded-full bg-warning"
                        style={{
                          height: `${Math.min(100, (p.qty / p.min) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Atividade recente */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Atividade recente</CardTitle>
            <CardDescription>Últimas movimentações</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {activity.map((a, i) => (
              <div key={i} className="flex items-start gap-3">
                <div
                  className={
                    "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full " +
                    (a.in
                      ? "bg-success/15 text-success"
                      : "bg-destructive/15 text-destructive")
                  }
                >
                  {a.in ? (
                    <ArrowDownRight className="h-4 w-4" />
                  ) : (
                    <ArrowUpRight className="h-4 w-4" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{a.label}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {a.item}
                  </p>
                </div>
                <span className="whitespace-nowrap text-[11px] text-muted-foreground">
                  {a.time}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
