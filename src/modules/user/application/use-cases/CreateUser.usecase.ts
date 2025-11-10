// ============================================================
// FILE: src/modules/user/application/use-cases/CreateUser.usecase.ts
// ============================================================

import { User } from '../../domain/User.entity';
import { UserRepository } from '../../repository/User.repository';
import { CreateuserDTO } from '../../dto/CreateUser.dto';
import { UserMapper } from '../../mappers/User.mapper';
import { makeUserEmailUniqueSpec } from '../../domain/specifications/UserEmailUniqueSpec';

export class UserCreatedUseCase {
    constructor (private readonly userRepo: UserRepository) {}

    async execute(dto: CreateuserDTO): Promise<User> {
        const emailSpec = makeUserEmailUniqueSpec(this.userRepo);
        await emailSpec.assert(dto.email);

        const props = UserMapper.toDomainprops(dto);
        
        const created = await this.userRepo.create(props);
        
        created.markCreated();
        return created;
    }
}
