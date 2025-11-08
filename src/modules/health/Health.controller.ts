// ============================================================================
// FILE: src/modules/health/Health.controller.ts
// ============================================================================

import { Request, Response } from 'express';
import { PrismaService } from '../../infrastructure/database/prisma/PrismaService';
import { HttpStatus } from '../../core/enums/HttpStatus.enum';
import { checkDatabase } from './checks/Database.check';
import { ERROR_MESSAGES } from '../../common/constants/error-messages.constants';
import { ResponseHandler } from '../../common/utils/ResponseHandler.util';
export class HealthController {
  constructor(private prismaService: PrismaService) {}
  public getHealth = async (_req: Request, res: Response): Promise<void> => {
    try {
      const result = await checkDatabase(this.prismaService);
      const isUp = result.status === 'ok';

      const data = {
        success: isUp? 'UP' : 'DOWN',
        checks: {
          database: {
            status: result.status,
            db: result.db,
            error: 'error' in result ? result.error : undefined
          }
        }
      }
      ResponseHandler.success(
        res,
        data,
        "System health check completed",
        isUp? HttpStatus.OK : HttpStatus.SERVICE_UNAVAILABLE
      )
    } catch (error: unknown) {

      ResponseHandler.error(
        res,
        {
          code: 'DATABASE_CONNECTION_ISSUE',
          stack: (error as Error).stack
        },
        ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  };
}