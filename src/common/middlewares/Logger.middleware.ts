// ============================================================================
// FILE: src/common/middlewares/Logger.middleware.ts (FIXED - Remove console.log)
// ============================================================================

import { Request, Response, NextFunction } from 'express';
import { BaseMiddleware } from '../../core/abstracts/BaseMiddleware';
import { DateHelper } from '../utils/DateHelper.util';

export class LoggerMiddleware extends BaseMiddleware {
  public async handle(req: Request, _res: Response, next: NextFunction): Promise<void> {
    const logEntry = {
      timestamp: DateHelper.toDateTimeString(),
      method: req.method,
      url: req.originalUrl,
      query: req.query,
      params: req.params,
      body: req.body,
    };

    this.logger?.info('Incoming Request', logEntry);
    next();
  }
}
