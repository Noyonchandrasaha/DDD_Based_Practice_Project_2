// ============================================================================
// FILE: src/core/types/FilterOptions.type.ts
// ============================================================================

import { FilterOperator } from '../enums/FilterOperator.enum';
import { SortOrder } from './SortOrder.type';


export interface FilterCondition<T = any> {
  field: string;
  operator: FilterOperator;
  value: T | T[];
}


export interface FilterOptions {
  filters?: FilterCondition[];
  or?: FilterCondition[];
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortOrder?: SortOrder;
}
