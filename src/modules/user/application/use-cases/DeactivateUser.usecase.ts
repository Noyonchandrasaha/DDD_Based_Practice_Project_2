// ============================================================
// FILE: src/modules/user/application/use-cases/DeactivateUser.usecase.ts
// ============================================================

import { User } from '../../domain/User.entity';
import { UserRepository } from '../../repository/User.repository';

export class DeactivateUserUseCase{
    constructor(private readonly userRepo: UserRepository) {}

    async execute(id: string): Promise<User> {
        const existing = await this.userRepo.findById(id);
        if(!existing) throw new Error('User not found');

        const deletedAt = (existing as any).deletedAt ?? null;
        if(deletedAt) throw new Error('User is soft-deleted');

        if(!existing.isActive) return existing;

        existing.deactivate('Manual deactivation');
        const update = await this.userRepo.update(id,{
            isActive: existing.isActive
        })

        return update;
    }
}