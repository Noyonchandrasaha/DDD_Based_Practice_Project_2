// ============================================================
// FILE: src/modules/user/application/use-cases/GetUser.usecase.ts
// ============================================================

import { User } from '../../domain/User.entity';
import { UserRepository } from '../../repository/User.repository';

type GetUserOptions = {
    includeDeleted?: boolean;
}

export class GetUserUseCase {
    constructor (private readonly userRepo: UserRepository){}

    async execute(id: string, options: GetUserOptions = {}): Promise<User> {
        const {includeDeleted = false} = options;

        const user = await this.userRepo.findById(id);
        if(!user){
            throw new Error('User not found');
        }

        const deletedAt = (user as any).deletedAt ?? null;
        if(!includeDeleted && deletedAt) {
            throw new Error('User not found.')
        }
        return user;
    }
}