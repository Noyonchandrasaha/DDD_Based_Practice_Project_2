// ============================================================================
// FILE: src/core/types/Pagination.type.ts
// ============================================================================

export interface PaginationOptions {
  page?: number;   // Default: 1
  limit?: number;  // Default: 10
  skip?: number;   // Computed automatically if not provided
}

export interface PaginationMeta {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: PaginationMeta;
}

export const computeSkip = (page: number = 1, limit: number = 10): number =>
  (page - 1) * limit;