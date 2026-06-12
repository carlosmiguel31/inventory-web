import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useProducts } from "@/features/products";
import { StockMovementForm } from "../components/StockMovementForm";

export default function StockNewMovementPage() {
  const navigate = useNavigate();

  const productsQuery = useProducts({ pageSize: 100 });
  const products = productsQuery.data?.data ?? [];

  function goToList() {
    navigate("/stock/movements");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={goToList}
          aria-label="Voltar"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Nova movimentação
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Registre uma entrada, saída, ajuste ou perda de estoque.
          </p>
        </div>
      </div>

      <Card className="max-w-2xl">
        <CardContent className="p-6">
          <StockMovementForm
            products={products}
            onSuccess={goToList}
            onCancel={goToList}
          />
        </CardContent>
      </Card>
    </div>
  );
}
