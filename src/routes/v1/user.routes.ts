// ============================================================
// FILE: src/routes/v1/user.routes.ts
// ============================================================

import { Router } from 'express';
import { PrismaService } from '../../infrastructure/database/prisma/PrismaService';
import { ILogger } from '../../core/interfaces/ILogger';
import { UserModule } from '../../modules/user';

// ✅ Validators
import { ValidatorMiddleware } from '../../common/middlewares/Validator.middleware';
import { CreateUserSchema } from '../../modules/user/validator/CreateUser.validator';
import { UpdateUserSchema } from '../../modules/user/validator/UpdateUser.validator';

export function createUserRouter(
  prismaService: PrismaService,
  logger?: ILogger
): Router {
  const router = Router();
  const userModule = new UserModule(prismaService, logger);

  // ---------------- Validation Middlewares ----------------
  const createUserValidator = new ValidatorMiddleware({ body: CreateUserSchema }, logger);
  const updateUserValidator = new ValidatorMiddleware({ body: UpdateUserSchema }, logger);

  // ---------------- Routes ----------------

  // Create a new user
  router.post(
    '/create',
    createUserValidator.execute(),
    userModule.controller.create.bind(userModule.controller)
  );

  // List users (with pagination, sorting, filtering)
  router.get(
    '/',
    userModule.controller.list.bind(userModule.controller)
  );

  // Get a single user by ID
  router.get(
    '/:id',
    userModule.controller.getById.bind(userModule.controller)
  );

  // Update user
  router.patch(
    '/:id',
    updateUserValidator.execute(),
    userModule.controller.update.bind(userModule.controller)
  );

  // Soft delete user
  router.delete(
    '/:id',
    userModule.controller.softDelete.bind(userModule.controller)
  );

  // Restore soft-deleted user
  router.post(
    '/:id/restore',
    userModule.controller.restore.bind(userModule.controller)
  );

  // Activate user
  router.post(
    '/:id/activate',
    userModule.controller.activate.bind(userModule.controller)
  );

  // Deactivate user
  router.post(
    '/:id/deactivate',
    userModule.controller.deactivate.bind(userModule.controller)
  );

  return router;
}
