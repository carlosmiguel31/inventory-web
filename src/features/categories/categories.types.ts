import type { ID, Timestamps } from "@/types/common";

export interface Category extends Timestamps {
  id: ID;
  name: string;
  description?: string | null;
  productCount?: number;
}

export type CreateCategoryDTO = Pick<Category, "name" | "description">;
export type UpdateCategoryDTO = Partial<CreateCategoryDTO>;
