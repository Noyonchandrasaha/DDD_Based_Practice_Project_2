// ============================================================================
// FILE: src/core/interfaces/IRepository.ts
// ============================================================================

import { QueryParams } from '../types/QueryParams.type';

export interface IRepository<T> {
  findById(id: string): Promise<T | null>;
  findAll(params?: QueryParams<Partial<T>>): Promise<T[]>;
  findOne(filter: Partial<T>): Promise<T | null>;
  create(data: Partial<T>): Promise<T>;
  update(id: string, data: Partial<T>): Promise<T>;
  delete(id: string): Promise<void>;
  count(filter?: Partial<T>): Promise<number>;
}
