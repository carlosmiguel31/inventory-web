import { createCrudService } from "@/services/http-crud";
import type {
  Category,
  CreateCategoryDTO,
  UpdateCategoryDTO,
} from "./categories.types";

export const categoriesService = createCrudService<
  Category,
  CreateCategoryDTO,
  UpdateCategoryDTO
>("categories");
