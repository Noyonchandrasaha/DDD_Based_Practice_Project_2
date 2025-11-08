// ============================================================
// FILE: src/routes/v1/user.routes.ts
// ============================================================
import { Router } from 'express';
import { UserModule } from '../../modules/user';
import { PrismaService } from '../../infrastructure/database/prisma/PrismaService';
import { ILogger } from '../../core/interfaces/ILogger';
import { ValidatorMiddleware } from '../../common/middlewares/Validator.middleware';
import { CreateUserSchema } from '../../modules/user/validator/CreateUser.validator';

export function createUserRouter(
  prismaService: PrismaService,
  logger?: ILogger
): Router {
  const router = Router();
  
  console.log('Creating UserModule...');
  const userModule = new UserModule(prismaService, logger);
  console.log('UserModule created:', userModule);

  // Create validation middleware
  const createUserValidator = new ValidatorMiddleware(
    { body: CreateUserSchema },
    logger
  );

  // ✅ FIX: Clean route definition - no need for wrapper function
  router.post(
    "/create",
    createUserValidator.execute(), // Validation happens here
    userModule.controller.createUser.bind(userModule.controller) // Bind controller context
  );

  return router;
}