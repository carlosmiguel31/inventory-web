/** Tipos compartilhados entre todos os módulos de negócio. */

export type ID = string;

export interface Timestamps {
  createdAt: string;
  updatedAt: string;
}

/** Parâmetros padrão de listagem (paginação/busca/ordenação). */
export interface ListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  [key: string]: unknown;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

/**
 * Envelope de resposta paginada. Ajuste para o formato real do seu backend
 * (ex.: se a API devolver { items, total } em vez de { data, meta }).
 */
export interface Paginated<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface ApiErrorBody {
  message?: string;
  error?: string;
  statusCode?: number;
}
