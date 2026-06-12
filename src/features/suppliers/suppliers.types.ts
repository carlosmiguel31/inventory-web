import type { ID, Timestamps } from "@/types/common";

export interface Supplier extends Timestamps {
  id: ID;
  name: string;
  email?: string | null;
  phone?: string | null;
  document?: string | null;
  address?: string | null;
  active: boolean;
}

/** Status (active) não é enviado no cadastro: o backend define o padrão. */
export interface CreateSupplierDTO {
  name: string;
  email?: string;
  phone?: string;
  document?: string;
  address?: string;
}

export type UpdateSupplierDTO = Partial<CreateSupplierDTO>;
