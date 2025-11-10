// ============================================================
// FILE: src/modules/user/application/use-cases/DeleteUser.usecase.ts
// ============================================================

import { User } from '../../domain/User.entity';
import { UserRepository } from '../../repository/User.repository';

export class UserDeleteUseCase {
    constructor (private readonly userRepo: UserRepository) {}

    async execute(id: string, deletedBy: string = 'system'): Promise<User> {
        const existing = await this.userRepo.findById(id);
        if(!existing) {
            throw new Error ('User not found');
        }

        const deletedAt = (existing as any).deletedAt ?? null;
        if(deletedAt) {
            throw new Error('User is already soft-deleted');
        }

        const deleted =await this.userRepo.softDelete(id);

        deleted.delete(deletedBy, 'soft-delete');
        return deleted;
    }
}