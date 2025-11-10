// ============================================================
// FILE: src/modules/user/application/handlers/CreateUser.handler.ts
// ============================================================

import { User } from '../../domain/User.entity';
import { CreateUserCommand } from './CreateUser.command';
import { UserMapper } from '../../mappers/User.mapper';
import { CreateuserDTO } from '../../dto/CreateUser.dto';
import { UserRepository } from '../../repository/User.repository'


export class CreateUserHandler {
    constructor(private readonly userRepo: UserRepository) {}

    async execute(command: CreateUserCommand): Promise<User> {
        const dto = CreateuserDTO.fromValidatedData({
            firstName: command.firstName ?? undefined,
            middleName: command.middleName ?? undefined,
            lastName: command.lastName,
            email: command.email,
            phoneNumber: command.phoneNumber,
            street: command.street,
            city: command.city,
            state: command.state ?? undefined,
            postalCode : command.postalCode ?? undefined,
            country: command.country
        });

        const props = UserMapper.toDomainprops(dto);
        const created = await this.userRepo.create(props);
        created.markCreated();
        return created;
    }
}