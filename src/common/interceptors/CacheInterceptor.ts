// ============================================================================
// FILE: src/common/interceptors/CacheInterceptor.ts (FIXED)
// ============================================================================

import { Request, Response, NextFunction, RequestHandler } from 'express';
import { inMemoryCache } from '../../infrastructure/cache/strategies/InMemoryCache.strategy';

export interface CacheInterceptorOptions {
  ttl?: number;
  key?: string;
}

export class CacheInterceptor {
  public static intercept(options: CacheInterceptorOptions = {}): RequestHandler {
    const ttl = options.ttl ?? 300;

    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const key = options.key ?? `${req.method}:${req.originalUrl}`;
        const cached = await inMemoryCache.get(key);

        if (cached) {
          res.json(cached);
          return;
        }

        const originalJson = res.json.bind(res);
        res.json = (body: any): Response => {
          inMemoryCache.set(key, body, ttl);
          return originalJson(body);
        };

        next();
      } catch (err) {
        next(err);
      }
    };
  }
}