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

export type CreateSupplierDTO = Omit<Supplier, "id" | "createdAt" | "updatedAt">;
export type UpdateSupplierDTO = Partial<CreateSupplierDTO>;
