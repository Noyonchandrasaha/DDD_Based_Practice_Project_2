// ============================================================
// FILE: src/modules/user/application/use-cases/RestoreUser.usecase.ts
// ============================================================

import { User } from '../../domain/User.entity';
import { UserRepository } from '../../repository/User.repository';

export class RestoreUserUseCAse {
    constructor(private readonly userRepo: UserRepository) {}

    async execute(id: string): Promise<User> {
        const existing = await this.userRepo.findById(id);
        if(!existing){
            throw new Error('User not found.');
        }

        const deletedAt = (existing as any).deletedAt ?? null;

        if(!deletedAt){
            throw new Error('User is not soft-deleted');
        }

    
        const restroed =await this.userRepo.restore(id);

        return restroed;
    }
}