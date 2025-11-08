// ============================================================================
// FILE: src/common/decorators/Cache.decorator.ts
// ============================================================================

import 'reflect-metadata';
import { RequestHandler, Request, Response, NextFunction } from 'express';
import { ROUTE_METADATA_KEY } from './Route.decorator';
import { inMemoryCache } from '../../infrastructure/cache/strategies/InMemoryCache.strategy';

export interface CacheOptions {
  ttl?: number;
  key?: string;
}

export function Cache(options: CacheOptions = {}): MethodDecorator {
  const ttl = options.ttl ?? 300;

  return (_target: Object, _propertyKey: string | symbol, descriptor: PropertyDescriptor): PropertyDescriptor => {
    const originalMethod = descriptor.value;
    const existingMiddlewares: RequestHandler[] =
      Reflect.getMetadata(ROUTE_METADATA_KEY.MIDDLEWARES, originalMethod) || [];

    const cacheMiddleware: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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

    existingMiddlewares.push(cacheMiddleware);
    Reflect.defineMetadata(ROUTE_METADATA_KEY.MIDDLEWARES, existingMiddlewares, originalMethod);
    return descriptor;
  };
}