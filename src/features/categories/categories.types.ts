import type { ID, Timestamps } from "@/types/common";

/**
 * Categoria. `code` é opcional pois nem todo backend possui o campo.
 * Mantém `id` e `name` (consumidos pelos selects do módulo de produtos).
 */
export interface Category extends Timestamps {
  id: ID;
  name: string;
  code?: string | null;
  active: boolean;
}

export interface CreateCategoryDTO {
  name: string;
  code?: string;
  active: boolean;
}

export type UpdateCategoryDTO = Partial<CreateCategoryDTO>;
