// ============================================================================
// FILE: src/core/abstracts/BaseService.ts 
// ============================================================================

import { IService } from '../interfaces/IService';
import { IRepository } from '../interfaces/IRepository';
import { PaginatedResult } from '../types/Pagination.type';
import { QueryParams } from '../types/QueryParams.type';
import { PaginationHelper } from '../../common/utils/Pagination.util';
import { NotFoundException } from '../../common/exceptions/NotFoundException';

export abstract class BaseService<T> implements IService<T> {
  protected repository: IRepository<T>;

  constructor(repository: IRepository<T>) {
    this.repository = repository;
  }

  async getById(id: string): Promise<T> {
    const item = await this.repository.findById(id);
    if (!item) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }
    return item;
  }

  async getAll(params?: QueryParams<Partial<T>>): Promise<PaginatedResult<T>> {
    const data = await this.repository.findAll(params);
    const totalItems = await this.repository.count(params?.filters);
    
    return PaginationHelper.paginateQuery(totalItems, data, {
      page: params?.page,
      limit: params?.limit
    });
  }

  async create(data: Partial<T>): Promise<T> {
    return this.repository.create(data);
  }

  async update(id: string, data: Partial<T>): Promise<T> {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }
    return this.repository.update(id, data);
  }

  async delete(id: string): Promise<void> {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }
    return this.repository.delete(id);
  }
}
