// ============================================================================
// FILE: src/core/interfaces/IService.ts
// ============================================================================

import { PaginatedResult } from '../types/Pagination.type';
import { QueryParams } from '../types/QueryParams.type';

export interface IService<T> {
  getById(id: string): Promise<T | null>;
  getAll(params?: QueryParams<Partial<T>>): Promise<PaginatedResult<T>>;
  create(data: Partial<T>): Promise<T>;
  update(id: string, data: Partial<T>): Promise<T>;
  delete(id: string): Promise<void>;
}
