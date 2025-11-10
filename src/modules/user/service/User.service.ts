// ============================================================
// FILE: src/modules/user/application/services/User.service.ts
// ============================================================

import { QueryParams } from '@core/types/QueryParams.type';
import { CreateuserDTO } from '../dto/CreateUser.dto';
import { UpdateUserInput } from '../validator/UpdateUser.validator';
import { User } from '../domain/User.entity';
import { PaginatedResult } from '@core/types/Pagination.type';

import { UserCreatedUseCase } from '../application/use-cases/CreateUser.usecase';
import { UserUpdateUseCase } from '../application/use-cases/UpdateUser.usecase';
import { UserDeleteUseCase } from '../application/use-cases/DeleteUser.usecase';
import { RestoreUserUseCAse } from '../application/use-cases/RestoreUser.usecase';
import { ActivateUserUseCase } from '../application/use-cases/ActivateUser.usecase';
import { DeactivateUserUseCase } from '../application/use-cases/DeactivateUser.usecase';
import { GetUserUseCase } from '../application/use-cases/GetUser.usecase';
import { ListUsersUseCase } from '../application/use-cases/ListUsers.usecase';

export class UserService {
  constructor(
    private readonly createUserUC: UserCreatedUseCase,
    private readonly updateUserUC: UserUpdateUseCase,
    private readonly deleteUserUC: UserDeleteUseCase,
    private readonly restoreUserUC: RestoreUserUseCAse,
    private readonly activateUserUC: ActivateUserUseCase,
    private readonly deactivateUserUC: DeactivateUserUseCase,
    private readonly getUserUC: GetUserUseCase,
    private readonly listUsersUC: ListUsersUseCase
  ) {}

  // Commands: return domain; controller maps to ResponseDTO
  create(dto: CreateuserDTO): Promise<User> {
    return this.createUserUC.execute(dto);
  }

  update(id: string, input: UpdateUserInput): Promise<User> {
    return this.updateUserUC.execute(id, input);
  }

  softDelete(id: string, deletedBy = 'system'): Promise<User> {
    return this.deleteUserUC.execute(id, deletedBy);
  }

  restore(id: string): Promise<User> {
    return this.restoreUserUC.execute(id);
  }

  activate(id: string, activatedBy = 'system'): Promise<User> {
    return this.activateUserUC.execute(id, activatedBy);
  }

  deactivate(id: string): Promise<User> {
    return this.deactivateUserUC.execute(id);
  }

  // Queries
  getById(id: string, includeDeleted = false): Promise<User> {
    return this.getUserUC.execute(id, { includeDeleted });
  }

  list(params?: QueryParams<Partial<User>>): Promise<PaginatedResult<User>> {
    return this.listUsersUC.execute(params);
  }
}
