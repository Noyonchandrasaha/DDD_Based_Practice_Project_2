// ============================================================================
// FILE: src/infrastructure/database/repositories/BaseRepository.ts
// ============================================================================

import { PrismaClient } from '../../../../generated/prisma';
import { BaseRepository as CoreBaseRepository } from '../../../core/abstracts/BaseRepository';
import { QueryParams } from '../../../core/types/QueryParams.type';
import { PaginationHelper } from '../../../common/utils/Pagination.util';

export abstract class PrismaBaseRepository<T> extends CoreBaseRepository<T> {
  protected dataSource: PrismaClient;
  protected abstract modelName: string;

  constructor(prisma: PrismaClient) {
    super();
    this.dataSource = prisma;
  }

  protected get model(): any {
    return (this.dataSource as any)[this.modelName];
  }

  async findById(id: string): Promise<T | null> {
    return this.model.findUnique({ where: { id } });
  }

  async findOne(filter: Partial<T>): Promise<T | null> {
    return this.model.findFirst({ where: filter });
  }

  async findAll(params?: QueryParams<Partial<T>>): Promise<T[]> {
    const skip = PaginationHelper.getSkip(params?.page, params?.limit);
    const take = params?.limit || 10;

    return this.model.findMany({
      where: params?.filters,
      skip,
      take,
      orderBy: params?.sortBy ? { [params.sortBy]: params.sortOrder || 'asc' } : undefined,
    });
  }

  async create(data: Partial<T>): Promise<T> {
    return this.model.create({ data });
  }

  async update(id: string, data: Partial<T>): Promise<T> {
    return this.model.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    await this.model.delete({ where: { id } });
  }

  async count(filter?: Partial<T>): Promise<number> {
    return this.model.count({ where: filter });
  }
}