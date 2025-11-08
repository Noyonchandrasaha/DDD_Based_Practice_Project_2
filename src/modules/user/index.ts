// ============================================================
// FILE: src/modules/user/index.ts
// ============================================================

// FILE: src/modules/user/index.ts
import { PrismaService } from '../../infrastructure/database/prisma/PrismaService';
import { PrismaClient } from '../../../generated/prisma';
import { UserRepository } from './repository/User.repository';
import { UserService } from './service/User.service';
import { UserController } from './controller/User.controller';
import { ILogger } from '../../core/interfaces/ILogger';

export class UserModule {
  public readonly repository: UserRepository;
  public readonly service: UserService;
  public readonly controller: UserController;

  constructor(prismaService: PrismaService, logger?: ILogger) {
    const prisma: PrismaClient = prismaService.prisma;

    this.repository = new UserRepository(prisma);
    this.service = new UserService(this.repository); // ✅ repository injected
    this.controller = new UserController(this.service); // ✅ service injected
    console.log(`UserModule initialized with controller:`, this.controller); // Log controller creation

    logger?.info('UserModule initialized');
  }
}
