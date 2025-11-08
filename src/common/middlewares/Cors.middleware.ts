// ============================================================================
// FILE: src/common/middlewares/Cors.middleware.ts
// ============================================================================

import { Request, Response, NextFunction } from 'express';
import cors, { CorsOptions } from 'cors';
import { BaseMiddleware } from '../../core/abstracts/BaseMiddleware';
import { ILogger } from '../../core/interfaces/ILogger';

export interface CorsMiddlewareOptions extends CorsOptions {
  logger?: ILogger;
}

export class CorsMiddleware extends BaseMiddleware {
  private options: CorsMiddlewareOptions;

  constructor(options: CorsMiddlewareOptions = {}) {
    super(options.logger);
    this.options = options;
  }

  public async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      cors(this.options)(req, res, next);
    } catch (err: unknown) {
      this.logger?.error('CORS middleware error', undefined,{ error: err instanceof Error ? err : new Error(String(err)) });

      // Pass an actual Error object to next()
      const error: Error = err instanceof Error ? err : new Error('Unknown CORS error');
      next(error);
    }
  }
}
