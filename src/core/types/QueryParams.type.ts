// ============================================================================
// FILE: src/core/types/QueryParams.type.ts
// ============================================================================

import { SortOrder } from './SortOrder.type';


export interface QueryParams<TFilters = Record<string, string | number | boolean | null>> {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: SortOrder;
  search?: string;
  filters?: TFilters;
  include?: string[]; 
  exclude?: string[];
}
