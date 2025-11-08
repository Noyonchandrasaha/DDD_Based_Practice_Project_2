// ============================================================
// FILE: src/modules/user/application/handlers/CreateUser.handler.ts
// ============================================================
import { User } from '../../domain/User.entity';
import { CreateUserCommand } from '../commands/CreateUser.command';
import { UserMapper } from '../../mappers/User.mapper';
import { CreateUserDTO } from '../../dto/CreateUser.dto';

export class CreateUserHandler {
  async execute(command: CreateUserCommand): Promise<User> {
    // ✅ FIX: Use fromValidatedData instead of create
    const dto = CreateUserDTO.fromValidatedData({
      firstName: command.firstName ?? undefined,
      middleName: command.middleName ?? undefined,
      lastName: command.lastName,
      email: command.email,
      phoneNumber: command.phoneNumber,
      street: command.street,
      city: command.city,
      state: command.state ?? undefined,
      postalCode: command.postalCode ?? undefined,
      country: command.country,
    });

    const props = UserMapper.toDomainProps(dto);
    return User.create(props);
  }
}