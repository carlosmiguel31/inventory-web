import { createCrudService } from "@/services/http-crud";
import type {
  CreateStockMovementDTO,
  StockMovement,
} from "./stock.types";

/** Convenção de rota: /api/stock/movements */
export const stockService = createCrudService<
  StockMovement,
  CreateStockMovementDTO,
  never
>("stock/movements");
