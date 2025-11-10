// ============================================================
// FILE: src/modules/user/index.ts
// ============================================================

import { PrismaClient } from '../../../generated/prisma';
import { PrismaService } from '../../infrastructure/database/prisma/PrismaService';

import { UserRepository } from './repository/User.repository';
import { UserService } from './service/User.service';
import { UserController } from './controller/User.controller';

// ---- Use Cases ----
import { UserCreatedUseCase } from './application/use-cases/CreateUser.usecase';
import { UserUpdateUseCase } from './application/use-cases/UpdateUser.usecase';
import { UserDeleteUseCase } from './application/use-cases/DeleteUser.usecase';
import { RestoreUserUseCAse } from './application/use-cases/RestoreUser.usecase';
import { ActivateUserUseCase } from './application/use-cases/ActivateUser.usecase';
import { DeactivateUserUseCase } from './application/use-cases/DeactivateUser.usecase';
import { GetUserUseCase } from './application/use-cases/GetUser.usecase';
import { ListUsersUseCase } from './application/use-cases/ListUsers.usecase';

// ---- Optional: logger interface ----
import { ILogger } from '../../core/interfaces/ILogger';

export class UserModule {
  public readonly repository: UserRepository;
  public readonly service: UserService;
  public readonly controller: UserController;

  constructor(prismaService: PrismaService, logger?: ILogger) {
    const prisma: PrismaClient = prismaService.prisma;

    // 1️⃣ Infrastructure
    this.repository = new UserRepository(prisma);

    // 2️⃣ Application layer – Use Cases
    const createUserUC   = new UserCreatedUseCase(this.repository);
    const updateUserUC   = new UserUpdateUseCase(this.repository);
    const deleteUserUC   = new UserDeleteUseCase(this.repository);
    const restoreUserUC  = new RestoreUserUseCAse(this.repository);
    const activateUserUC = new ActivateUserUseCase(this.repository);
    const deactivateUC   = new DeactivateUserUseCase(this.repository);
    const getUserUC      = new GetUserUseCase(this.repository);
    const listUsersUC    = new ListUsersUseCase(this.repository);

    // 3️⃣ Service layer
    this.service = new UserService(
      createUserUC,
      updateUserUC,
      deleteUserUC,
      restoreUserUC,
      activateUserUC,
      deactivateUC,
      getUserUC,
      listUsersUC
    );

    // 4️⃣ Presentation (Controller)
    this.controller = new UserController(this.service);

    logger?.info?.('✅ UserModule initialized');
  }
}
