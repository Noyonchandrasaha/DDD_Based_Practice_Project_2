// ============================================================
// FILE: src/modules/user/application/use-cases/ListUsers.usecase.ts
// ============================================================

import { User } from '../../domain/User.entity';
import { UserRepository } from '../../repository/User.repository';
import { QueryParams } from '@core/types/QueryParams.type';
import { PaginatedResult } from '@core/types/Pagination.type';

export class ListUsersUseCase {
    constructor (private readonly userRepo: UserRepository) {}

    async execute(
        params?: QueryParams<Partial<User>>
    ): Promise<PaginatedResult<User>> {
        const normalized = this.normalize(params);
        return this.userRepo.findPaginated(normalized);
    }

    private normalize(
        p?: QueryParams<Partial<User>>
    ): QueryParams<Partial<User>> {
        const page = Math.max(1, Number(p?.page??1));

        const rawLimit = Number(p?.limit ?? 10);
        const limit = Math.min(Math.max(1, rawLimit), 100);

        const sortBy = p?.sortBy ?? 'createdAt';
        const sortOrder = p?.sortOrder === 'desc' ? 'desc' :'asc';

        const searchTrimmed = (p?.search ?? '').trim();

        const search = searchTrimmed.length ? searchTrimmed : undefined;

        const filters = p?.filters && Object.keys(p.filters).length ? p.filters : undefined;
        return {page, limit, sortBy, sortOrder, search, filters}
    } 
}
