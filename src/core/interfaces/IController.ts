// ============================================================================
// FILE: src/core/interfaces/IController.ts
// ============================================================================

import { Request, Response, NextFunction, Router } from 'express';
import { IValidator } from './IValidator';
import { IMiddleware } from './IMiddleware';
import { IService } from './IService';

export interface IController<T = any> {
  basePath: string;
  router: Router;
  service: IService<T>;
  validator?: IValidator;
  middlewares?: IMiddleware[];
  initializeRoutes(): void;
  getAll?(req: Request, res: Response, next: NextFunction): Promise<void>;
  getById?(req: Request, res: Response, next: NextFunction): Promise<void>;
  create?(req: Request, res: Response, next: NextFunction): Promise<void>;
  update?(req: Request, res: Response, next: NextFunction): Promise<void>;
  delete?(req: Request, res: Response, next: NextFunction): Promise<void>;
}
