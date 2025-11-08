// ============================================================
// FILE: src/core/abstracts/BaseMiddleware.ts
// ============================================================

import { Request, Response, NextFunction, RequestHandler, ErrorRequestHandler } from 'express';
import { ILogger } from '../interfaces/ILogger';
import { WinstonLogger } from '../../infrastructure/logging/Winston.logger';

// === REGULAR MIDDLEWARE (3 args) ===
export abstract class BaseMiddleware {
  protected readonly logger: ILogger;

  constructor(logger?: ILogger) {
    this.logger = logger || new WinstonLogger();
  }

  public abstract handle(req: Request, res: Response, next: NextFunction): Promise<void> | void;

  public execute(): RequestHandler {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        await this.handle(req, res, next);
      } catch (error: any) {
        this.logger.error('Middleware failed',error, { middleware: this.constructor.name });
        next(error);
      }
    };
  }
}

// === ERROR HANDLER MIDDLEWARE (4 args) ===
export abstract class ErrorHandlerMiddleware {
  protected readonly logger: ILogger;

  constructor(logger?: ILogger) {
    this.logger = logger || new WinstonLogger();
  }

  public abstract handle(
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
  ): void;

  public execute(): ErrorRequestHandler {
    return (err: any, req: Request, res: Response, next: NextFunction): void => {
      this.handle(err, req, res, next);
    };
  }
}