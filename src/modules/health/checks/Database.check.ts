// ============================================================================
// FILE: src/modules/health/checks/Database.check.ts
// ============================================================================

import { PrismaService } from '../../../infrastructure/database/prisma/PrismaService';
import { ILogger } from '../../../core/interfaces/ILogger';
import { WinstonLogger } from '../../../infrastructure/logging/Winston.logger';


export const checkDatabase = async (prismaService: PrismaService) => {
  const logger: ILogger = new WinstonLogger();
  try {
    const isHealthy = await prismaService.healthCheck();
    return isHealthy
      ? { status: 'ok', db: 'UP' }
      : { status: 'fail', db: 'DOWN' };
  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error(String(error));
    logger.error('Database health check error', err);
    return { status: 'fail', db: 'DOWN', error: err.message };
  }
};






