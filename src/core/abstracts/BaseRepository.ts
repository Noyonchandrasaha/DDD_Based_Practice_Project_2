// ============================================================
// FILE: src/core/abstracts/BaseRepository.ts
// ============================================================

import { IRepository } from '../interfaces/IRepository';
import { QueryParams } from '../types/QueryParams.type';
import { SortOrder } from '../types/SortOrder.type';
import { PaginatedResult, computeSkip } from '../types/Pagination.type';

export abstract class BaseRepository<T> implements IRepository<T> {
  
  protected abstract dataSource: any;

  async findById(id: string): Promise<T | null> {
    const record = await this.dataSource.findUnique({
      where: { id }
    });
    return record ? this.toDomain(record) : null;
  }

  async findOne(filter: Partial<T>): Promise<T | null> {
    const where = this.toPrismaFilter(filter);
    const record = await this.dataSource.findFirst({
      where
    });
    return record ? this.toDomain(record) : null;
  }

  async findAll(params?: QueryParams<Partial<T>>): Promise<T[]> {
    const { where, orderBy, skip, take } = this.buildQuery(params);
    
    const records = await this.dataSource.findMany({
      where,
      orderBy,
      skip,
      take
    });

    return records.map((record: any) => this.toDomain(record));
  }

  async findPaginated(params?: QueryParams<Partial<T>>): Promise<PaginatedResult<T>> {
    const { where, orderBy, skip, take } = this.buildQuery(params);
    
    const [records, totalCount] = await Promise.all([
      this.dataSource.findMany({
        where,
        orderBy,
        skip,
        take
      }),
      this.dataSource.count({ where })
    ]);

    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const totalPages = Math.ceil(totalCount / limit);

    return {
      data: records.map((record: any) => this.toDomain(record)),
      meta: {
        totalItems: totalCount,
        totalPages,
        currentPage: page,
        pageSize: limit
      }
    };
  }

  async create(data: Partial<T>): Promise<T> {
    const createData = this.toPrismaCreate(data);
    const record = await this.dataSource.create({
      data: createData
    });
    return this.toDomain(record);
  }

  async update(id: string, data: Partial<T>): Promise<T> {
    const updateData = this.toPrismaUpdate(data);
    const record = await this.dataSource.update({
      where: { id },
      data: updateData
    });
    return this.toDomain(record);
  }

  async delete(id: string): Promise<void> {
    await this.dataSource.delete({
      where: { id }
    });
  }

  async count(filter?: Partial<T>): Promise<number> {
    const where = filter ? this.toPrismaFilter(filter) : {};
    return await this.dataSource.count({ where });
  }

  // ==================== Protected Abstract Methods ====================
  protected abstract toDomain(record: any): T;
  protected abstract toPrismaFilter(filter: Partial<T>): any;
  protected abstract toPrismaCreate(data: Partial<T>): any;
  protected abstract toPrismaUpdate(data: Partial<T>): any;

  // ==================== Query Building Methods ====================
  protected buildQuery(params?: QueryParams<Partial<T>>) {
    const where = this.buildWhereClause(params);
    const orderBy = this.buildOrderByClause(params);
    const { skip, take } = this.buildPaginationClause(params);

    return { where, orderBy, skip, take };
  }

  protected buildWhereClause(params?: QueryParams<Partial<T>>): any {
    const where: any = {};

    // Basic filters
    if (params?.filters) {
      Object.assign(where, this.toPrismaFilter(params.filters));
    }

    // Search across multiple fields
    if (params?.search) {
      where.OR = this.buildSearchClause(params.search);
    }

    // Advanced filter conditions
    if (params?.filters && typeof params.filters === 'object') {
      Object.assign(where, this.buildAdvancedFilters(params.filters));
    }

    return Object.keys(where).length > 0 ? where : undefined;
  }

  protected buildSearchClause(_search: string): any[] {
    // Override this in child classes for specific search logic
    return [];
  }

  protected buildAdvancedFilters(filters: any): any {
    const where: any = {};
    
    for (const [field, value] of Object.entries(filters)) {
      if (value !== undefined && value !== null) {
        where[field] = this.mapFilterValue(value);
      }
    }
    
    return where;
  }

  protected mapFilterValue(value: any): any {
    if (typeof value === 'string') {
      return { contains: value, mode: 'insensitive' };
    }
    return value;
  }

  protected buildOrderByClause(params?: QueryParams<Partial<T>>): any {
    if (!params?.sortBy) return undefined;

    const sortOrder = params.sortOrder || 'asc';
    
    return {
      [params.sortBy]: sortOrder
    };
  }

  protected buildPaginationClause(params?: QueryParams<Partial<T>>): { skip?: number; take?: number } {
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    
    return {
      skip: computeSkip(page, limit),
      take: limit
    };
  }

  // ==================== Deprecated Methods (for backward compatibility) ====================
  protected applySorting(query: any, sortBy?: string, sortOrder?: SortOrder): any {
    if (sortBy) {
      query.orderBy = { [sortBy]: sortOrder || 'asc' };
    }
    return query;
  }

  protected applyPagination(query: any, page?: number, limit?: number): any {
    if (page && limit) {
      query.skip = computeSkip(page, limit);
      query.take = limit;
    }
    return query;
  }
}


// ============================================================
// FILE: src/core/abstracts/BaseRepository.ts
// ============================================================

// import { IRepository } from '../interfaces/IRepository';
// import { QueryParams } from '../types/QueryParams.type';
// import { SortOrder } from '../types/SortOrder.type';


// export abstract class BaseRepository<T> implements IRepository<T> {
  
//   // Child class must provide data source access (ORM model, DB connection)
//   protected abstract dataSource: any;

//   async findById(_id: string): Promise<T | null> {
//     throw new Error('Method not implemented. Override in child class.');
//   }

//   async findOne(_filter: Partial<T>): Promise<T | null> {
//     throw new Error('Method not implemented. Override in child class.');
//   }

//   async findAll(_params?: QueryParams<Partial<T>>): Promise<T[]> {
//     throw new Error('Method not implemented. Override in child class.');
//   }

//   async create(_data: Partial<T>): Promise<T> {
//     throw new Error('Method not implemented. Override in child class.');
//   }

//   async update(_id: string, _data: Partial<T>): Promise<T> {
//     throw new Error('Method not implemented. Override in child class.');
//   }

//   async delete(_id: string): Promise<void> {
//     throw new Error('Method not implemented. Override in child class.');
//   }

//   async count(_filter?: Partial<T>): Promise<number> {
//     throw new Error('Method not implemented. Override in child class.');
//   }

//   protected abstract applySorting(query: any, sortBy?: string, sortOrder?: SortOrder): any;
//   protected abstract applyPagination(query: any, page?: number, limit?: number): any;
// }
