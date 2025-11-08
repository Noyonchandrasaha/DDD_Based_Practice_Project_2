// ============================================================================
// FILE: src/routes/v1/index.ts
// ============================================================================

import { Router } from 'express';
import { PrismaService } from '../../infrastructure/database/prisma/PrismaService';
import { createHealthRouter } from './health.routes';
import { ILogger } from '../../core/interfaces/ILogger';

export class V1Routes {
  public router: Router;

  constructor(prismaService: PrismaService, logger?: ILogger) {
    this.router = Router();
    this.initializeRoutes(prismaService, logger);
  }

  private initializeRoutes(prismaService: PrismaService, _logger?: ILogger): void {
    // Health check routes
    this.router.use('/health', createHealthRouter(prismaService));
  }
}
