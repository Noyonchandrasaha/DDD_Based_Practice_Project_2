// ============================================================
// FILE: src/core/abstracts/BaseRepository.ts
// ============================================================

import { IRepository } from '../interfaces/IRepository';
import { QueryParams } from '../types/QueryParams.type';
import { SortOrder } from '../types/SortOrder.type';
import { PaginatedResult, computeSkip } from '../types/Pagination.type';

/**
 * Minimal shape expected from a data source (e.g., Prisma delegate).
 * Using structural typing so child repos can provide Prisma delegates directly.
 */
type DataSourceLike = {
  findUnique(args: { where: any }): Promise<any | null>;
  findFirst(args: { where?: any; orderBy?: any; skip?: number; take?: number }): Promise<any | null>;
  findMany(args: { where?: any; orderBy?: any; skip?: number; take?: number }): Promise<any[]>;
  create(args: { data: any }): Promise<any>;
  update(args: { where: any; data: any }): Promise<any>;
  delete(args: { where: any }): Promise<any>;
  count(args: { where?: any }): Promise<number>;
};

export abstract class BaseRepository<T> implements IRepository<T> {
  // Child classes must expose a Prisma-like delegate (via getter is fine)
  protected abstract get dataSource(): DataSourceLike;

  // ==================== CRUD ====================

  async findById(id: string): Promise<T | null> {
    const record = await this.dataSource.findUnique({ where: { id } });
    return record ? this.toDomain(record) : null;
  }

  async findOne(filter: Partial<T>): Promise<T | null> {
    const where = this.toPrismaFilter(filter);
    const record = await this.dataSource.findFirst({ where });
    return record ? this.toDomain(record) : null;
  }

  async findAll(params?: QueryParams<Partial<T>>): Promise<T[]> {
    const { where, orderBy, skip, take } = this.buildQuery(params);
    const records = await this.dataSource.findMany({ where, orderBy, skip, take });
    return records.map((r: any) => this.toDomain(r));
  }

  async findPaginated(params?: QueryParams<Partial<T>>): Promise<PaginatedResult<T>> {
    const { where, orderBy, skip, take } = this.buildQuery(params);

    const [records, totalCount] = await Promise.all([
      this.dataSource.findMany({ where, orderBy, skip, take }),
      this.dataSource.count({ where })
    ]);

    const page = params?.page ?? 1;
    const limit = params?.limit ?? 10;
    const totalPages = Math.ceil(totalCount / limit);

    return {
      data: records.map((r: any) => this.toDomain(r)),
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
    const record = await this.dataSource.create({ data: createData });
    return this.toDomain(record);
  }

  async update(id: string, data: Partial<T>): Promise<T> {
    const updateData = this.toPrismaUpdate(data);
    try {
      const record = await this.dataSource.update({ where: { id }, data: updateData });
      return this.toDomain(record);
    } catch (e: any) {
      this.handleWriteError(e, 'update');
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await selfOrThrow(this.dataSource.delete({ where: { id } }));
    } catch (e: any) {
      this.handleWriteError(e, 'delete');
    }
  }

  async count(filter?: Partial<T>): Promise<number> {
    const where = filter ? this.toPrismaFilter(filter) : undefined;
    return this.dataSource.count({ where });
  }

  // ==================== Protected Abstract Mappers ====================

  protected abstract toDomain(record: any): T;
  protected abstract toPrismaFilter(filter: Partial<T>): any;
  protected abstract toPrismaCreate(data: Partial<T>): any;
  protected abstract toPrismaUpdate(data: Partial<T>): any;

  // ==================== Query Building ====================

  protected buildQuery(params?: QueryParams<Partial<T>>) {
    const where = this.buildWhereClause(params);
    const orderBy = this.buildOrderByClause(params);
    const { skip, take } = this.buildPaginationClause(params);
    return { where, orderBy, skip, take };
  }

  /**
   * Builds a Prisma "where" object. Safe by default:
   * - merges explicit filters from toPrismaFilter
   * - adds OR only when non-empty (avoids Prisma OR: [] error)
   * - adds advanced filters with conservative string behavior
   */
  protected buildWhereClause(params?: QueryParams<Partial<T>>): any {
    const where: any = {};

    // 1) Basic filters (domain-aware)
    if (params?.filters) {
      Object.assign(where, this.toPrismaFilter(params.filters));
    }

    // 2) Search across fields (subclasses should override buildSearchClause)
    if (params?.search) {
      const or = this.buildSearchClause(params.search);
      if (Array.isArray(or) && or.length > 0) {
        where.OR = or;
      }
    }

    // 3) Advanced filters (generic)
    if (params?.filters && typeof params.filters === 'object') {
      Object.assign(where, this.buildAdvancedFilters(params.filters));
    }

    return Object.keys(where).length > 0 ? where : undefined;
  }

  /**
   * Override in child classes to provide useful search fields.
   * Must return an array of OR conditions; default is [] (no search).
   */
  protected buildSearchClause(_search: string): any[] {
    return [];
  }

  /**
   * Conservative advanced filters:
   * - strings => contains (insensitive)
   * - other types => pass-through
   * Subclasses may override to handle exact fields specially.
   */
  protected buildAdvancedFilters(filters: Record<string, any>): any {
    const where: any = {};
    for (const [field, value] of Object.entries(filters)) {
      if (value === undefined || value === null) continue;
      where[field] = typeof value === 'string'
        ? { contains: value, mode: 'insensitive' }
        : value;
    }
    return where;
  }

  protected buildOrderByClause(params?: QueryParams<Partial<T>>): any {
    if (!params?.sortBy) return undefined;
    const sortOrder: SortOrder = params.sortOrder ?? 'asc';
    return { [params.sortBy]: sortOrder };
  }

  protected buildPaginationClause(params?: QueryParams<Partial<T>>): { skip?: number; take?: number } {
    const page = params?.page ?? 1;
    const limit = params?.limit ?? 10;
    return { skip: computeSkip(page, limit), take: limit };
  }

  // ==================== Error Handling ====================

  /**
   * Centralized write error mapping so apps don't leak ORM error codes.
   * Subclasses can override for domain-specific error classes.
   */
  protected handleWriteError(e: any, op: 'update' | 'delete' | 'create' = 'update'): never {
    // Prisma "Record not found" is typically P2025; keep generic fallback
    if (e?.code === 'P2025') {
      throw new Error(`Cannot ${op}: record not found`);
    }
    throw e;
  }
}

// helper
async function selfOrThrow<T>(p: Promise<T>): Promise<T> { return p; }

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
