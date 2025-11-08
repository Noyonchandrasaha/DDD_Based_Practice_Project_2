// ============================================================================
// FILE: src/common/interceptors/TransformInterceptor.ts
// ============================================================================

import { Request, Response, NextFunction, RequestHandler } from 'express';
import { DateHelper } from '../utils/DateHelper.util';

export interface TransformInterceptorOptions {
  wrapData?: boolean;
  defaultMessage?: string;
}

export class TransformInterceptor {
  public static intercept(options: TransformInterceptorOptions = {}): RequestHandler {
    const wrapData = options.wrapData ?? true;
    const defaultMessage = options.defaultMessage ?? 'Request successful';

    return (_req: Request, res: Response, next: NextFunction): void => {
      const originalJson = res.json.bind(res);

      res.json = (body: any): Response => {
        if (wrapData) {
          const wrapped = {
            success: true,
            message: defaultMessage,
            data: body,
            timestamp: DateHelper.toDateTimeString(),
          };
          return originalJson(wrapped);
        }

        return originalJson(body);
      };

      next();
    };
  }
}
