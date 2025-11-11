// ============================================================
// FILE: src/modules/user/application/use-cases/ListUsers.usecase.ts
// ============================================================

import { User } from '../../domain/User.entity';
import { UserRepository } from '../../repository/User.repository';
import { QueryParams } from '@core/types/QueryParams.type';
import { PaginatedResult } from '@core/types/Pagination.type';

export class ListUsersUseCase {
    constructor(private readonly userRepo: UserRepository) {}

    async execute(
        params?: QueryParams<Partial<User>>
    ): Promise<PaginatedResult<User>> {
        const normalized = this.normalize(params);
        return this.userRepo.findPaginated(normalized);
    }

    private normalize(
        p?: QueryParams<Partial<User>>
    ): QueryParams<Partial<User>> {
        const page = Math.max(1, Number(p?.page ?? 1)); // Ensure page is at least 1
        const rawLimit = Number(p?.limit ?? 10);
        const limit = Math.min(Math.max(1, rawLimit), 100); // Limit between 1 and 100

        const sortBy = p?.sortBy ?? 'createdAt'; // Default sort by createdAt
        const sortOrder = p?.sortOrder === 'desc' ? 'desc' : 'asc'; // Default to 'asc'

        const search = (p?.search ?? '').trim();
        const filters = p?.filters && Object.keys(p.filters).length ? p.filters : undefined; // Only pass filters if valid

        return {
            page,
            limit,
            sortBy,
            sortOrder,
            search: search.length ? search : undefined, // Avoid empty search string
            filters
        };
    }
}
