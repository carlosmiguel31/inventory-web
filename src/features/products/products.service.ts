import { createCrudService } from "@/services/http-crud";
import type {
  CreateProductDTO,
  Product,
  UpdateProductDTO,
} from "./products.types";

export const productsService = createCrudService<
  Product,
  CreateProductDTO,
  UpdateProductDTO
>("products");
