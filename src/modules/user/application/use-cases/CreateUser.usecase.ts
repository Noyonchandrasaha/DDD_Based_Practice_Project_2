// ============================================================
// FILE: src/modules/user/application/use-cases/CreateUser.usecase.ts
// ============================================================

import { CreateUserCommand } from '../commands/CreateUser.command';
import { CreateUserHandler } from '../commands/CreateUser.handler';
import { User } from '../../domain/User.entity';
import { UserRepository } from '../../repository/User.repository';

export class CreateUserUseCase {
  private readonly handler: CreateUserHandler;

  constructor(private readonly userRepo: UserRepository) {
    this.handler = new CreateUserHandler();
  }

  async execute(command: CreateUserCommand): Promise<User> {
    const user = await this.handler.execute(command);
    await this.userRepo.create(user);
    return user;
  }
}