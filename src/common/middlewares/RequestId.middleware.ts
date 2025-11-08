// ============================================================================
// FILE: src/common/middlewares/RequestId.middleware.ts
// ============================================================================

import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { BaseMiddleware } from '../../core/abstracts/BaseMiddleware';

export interface RequestWithId extends Request {
  requestId: string;
}

export class RequestIdMiddleware extends BaseMiddleware {
  public async handle(req: RequestWithId, res: Response, next: NextFunction): Promise<void> {
    req.requestId = uuidv4();
    res.setHeader('X-Request-ID', req.requestId); 

    this.logger?.debug(`Request ID: ${req.requestId}`, {
      method: req.method,
      url: req.originalUrl,
    });

    next();
  }
}