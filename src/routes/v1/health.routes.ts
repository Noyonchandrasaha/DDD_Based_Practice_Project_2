// ============================================================================
// FILE: src/routes/v1/health.routes.ts
// ============================================================================

import { Router } from 'express';
import { HealthController } from '../../modules/health/Health.controller';
import { PrismaService } from '../../infrastructure/database/prisma/PrismaService';

export const createHealthRouter = (prismaService: PrismaService): Router => {
  const healthRouter = Router();
  const healthController = new HealthController(prismaService);
  healthRouter.get('/', (req, res) => {
    healthController.getHealth(req, res);
  });
  return healthRouter;
};