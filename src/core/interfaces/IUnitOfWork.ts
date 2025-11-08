// ============================================================================
// FILE: src/core/interfaces/IUnitOfWork.ts
// ============================================================================

import { IRepository } from './IRepository';

export interface IUnitOfWork {
  begin(): Promise<void>;
  commit(): Promise<void>;
  rollback(): Promise<void>;
  getRepository<TEntity>(entityName: string): IRepository<TEntity>;
  executeInTransaction<T>(fn: (unitOfWork: IUnitOfWork) => Promise<T>): Promise<T>;
}
