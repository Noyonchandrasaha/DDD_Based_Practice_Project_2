// ============================================================================
// FILE: src/common/middlewares/Compression.middleware.ts
// ============================================================================

import { Request, Response, NextFunction } from 'express';
import compression, { CompressionOptions } from 'compression';
import { BaseMiddleware } from '../../core/abstracts/BaseMiddleware';
import { ILogger } from '../../core/interfaces/ILogger';

export interface CompressionMiddlewareOptions extends CompressionOptions {
  logger?: ILogger;
}

export class CompressionMiddleware extends BaseMiddleware {
  private options: CompressionMiddlewareOptions;

  constructor(options: CompressionMiddlewareOptions = {}) {
    super(options.logger);
    this.options = options;
  }

  public async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      compression(this.options)(req, res, next);
    } catch (err: unknown) {
      this.logger?.error('Compression middleware error', undefined ,err instanceof Error ? { error: err } : { error: new Error('Unknown compression error') });
      next(err instanceof Error ? err : new Error('Unknown compression error'));
    }
  }
}
