import { createCrudService } from "@/services/http-crud";
import type {
  CreateSupplierDTO,
  Supplier,
  UpdateSupplierDTO,
} from "./suppliers.types";

export const suppliersService = createCrudService<
  Supplier,
  CreateSupplierDTO,
  UpdateSupplierDTO
>("suppliers");
