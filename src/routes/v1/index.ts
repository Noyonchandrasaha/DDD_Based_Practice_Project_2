// ============================================================================
// FILE: src/routes/v1/index.ts
// ============================================================================

import { Router } from 'express';
import { PrismaService } from '../../infrastructure/database/prisma/PrismaService';
import { createHealthRouter } from './health.routes';
import { createUserRouter } from './user.routes';
import { ILogger } from '../../core/interfaces/ILogger';

/**
 * V1Routes
 * ----------------------------------------
 * This class bootstraps all v1 API routes, ensuring clean modular routing.
 * Each feature module (User, Auth, etc.) defines its own router factory.
 */
export class V1Routes {
  public router: Router;

  constructor(prismaService: PrismaService, logger?: ILogger) {
    this.router = Router();
    this.initializeRoutes(prismaService, logger);
  }

  private initializeRoutes(prismaService: PrismaService, logger?: ILogger): void {
    // -----------------------------
    // Health check endpoints
    // -----------------------------
    this.router.use('/health', createHealthRouter(prismaService));

    // -----------------------------
    // User-related endpoints
    // -----------------------------
    this.router.use('/users', createUserRouter(prismaService, logger));

    // (Optional) Add future feature modules here
    // e.g. this.router.use('/auth', createAuthRouter(prismaService, logger));
  }
}
