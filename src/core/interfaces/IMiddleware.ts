// ============================================================================
// FILE: src/core/interfaces/IMiddleware.ts
// ============================================================================

import { Request, Response, NextFunction, RequestHandler } from 'express';

export interface IMiddleware {
  execute(): RequestHandler;
  handle?(req: Request, res: Response, next: NextFunction): Promise<void> | void;
}
