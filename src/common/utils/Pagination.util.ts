// ============================================================================
// FILE: src/common/utils/Pagination.util.ts
// ============================================================================

import { PaginationOptions, PaginationMeta, PaginatedResult, computeSkip } from '../../core/types/Pagination.type';

export class PaginationHelper {
  public static getSkip(page: number = 1, limit: number = 10): number {
    return computeSkip(page, limit);
  }

  public static getMeta(totalItems: number, page: number = 1, limit: number = 10): PaginationMeta {
    const totalPages = Math.ceil(totalItems / limit);
    return {
      totalItems,
      totalPages,
      currentPage: page,
      pageSize: limit,
    };
  }

  public static paginateArray<T>(items: T[], options: PaginationOptions = {}): PaginatedResult<T> {
    const page = options.page ?? 1;
    const limit = options.limit ?? 10;
    const skip = options.skip ?? this.getSkip(page, limit);

    const paginatedData = items.slice(skip, skip + limit);
    const meta = this.getMeta(items.length, page, limit);

    return {
      data: paginatedData,
      meta,
    };
  }

  public static paginateQuery<T>(total: number, data: T[], options: PaginationOptions = {}): PaginatedResult<T> {
    const page = options.page ?? 1;
    const limit = options.limit ?? 10;

    const meta = this.getMeta(total, page, limit);

    return {
      data,
      meta,
    };
  }
}
