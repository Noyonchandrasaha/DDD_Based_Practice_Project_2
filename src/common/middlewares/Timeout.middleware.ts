// ============================================================================
// FILE: src/common/middlewares/Timeout.middleware.ts
// ============================================================================
// src/common/middlewares/Timeout.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { BaseMiddleware } from '../../core/abstracts/BaseMiddleware';
import { HttpStatus } from '../../core/enums/HttpStatus.enum';
import { ResponseHandler } from '../utils/ResponseHandler.util';
import { ERROR_MESSAGES } from '../constants/error-messages.constants';

export class TimeoutMiddleware extends BaseMiddleware {
  private timeoutMs: number;
  private timer: NodeJS.Timeout | null = null;

  constructor(timeoutMs = 10000, logger?: any) {
    super(logger);
    this.timeoutMs = timeoutMs;
  }

  public async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    let timedOut = false; 

    this.timer = setTimeout(() => {
      timedOut = true;
      this.logger?.warn(`Request timed out after ${this.timeoutMs}ms`, {
        method: req.method,
        url: req.originalUrl,
      });

      if (!res.headersSent) {
        ResponseHandler.error(
          res,
          null,
          ERROR_MESSAGES.TIMEOUT,
          HttpStatus.REQUEST_TIMEOUT
        )
      }
    }, this.timeoutMs);

    try {
      await next();
    } catch (err) {
      next(err);
    } finally {
      if (this.timer) clearTimeout(this.timer);
      // Optional: prevent double response
      if (timedOut && !res.headersSent) {
        res.end();
      }
    }
  }
}