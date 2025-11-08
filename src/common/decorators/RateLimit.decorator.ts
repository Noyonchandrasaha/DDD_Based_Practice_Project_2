// ============================================================================
// FILE: src/common/decorators/RateLimit.decorator.ts
// ============================================================================

import 'reflect-metadata';
import { RequestHandler } from 'express';
import { ROUTE_METADATA_KEY } from './Route.decorator';
import { ERROR_MESSAGES } from '../constants/error-messages.constants';
import { ResponseHandler } from '../utils/ResponseHandler.util';
import { HttpStatus } from '../../core/enums/HttpStatus.enum';


// Options for the RateLimit decorator
export interface RateLimitOptions {
  windowMs?: number;    // Time window in milliseconds (default: 1 minute)
  max?: number;         // Max requests per window (default: 60)
  message?: string;     // Optional custom message
}


//Rate limit store (in-memory)
//Use a distributed store (Redis) for production across multiple instances
const rateLimitStore = new Map<string, { count: number; firstRequestTime: number }>();


// RateLimit decorator
// Attaches rate limiting middleware to a route
// Usage:
// @RateLimit({ windowMs: 60000, max: 10 })
export function RateLimit(options: RateLimitOptions = {}): MethodDecorator {
  const windowMs = options.windowMs ?? 60_000; // default 1 minute
  const maxRequests = options.max ?? 60;       // default 60 requests per window
  const message = options.message ?? ERROR_MESSAGES.TOO_MANY_REQUESTS;

  return (_target: Object, _propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
    const rateLimitMiddleware: RequestHandler = (req, res, next) => {
      const key: string = req.ip || 'unknown';
      const now = Date.now();
      const entry = rateLimitStore.get(key);

      if (!entry) {
        rateLimitStore.set(key, { count: 1, firstRequestTime: now });
        return next();
      }

      if (now - entry.firstRequestTime < windowMs) {
        // within window
        if (entry.count >= maxRequests) {
          return ResponseHandler.error(
            res,
            {code: "TOO_MANY_REQUEST"},
            message,
            HttpStatus.TOO_MANY_REQUESTS
          )
        }
        entry.count += 1;
      } else {
        // reset window
        rateLimitStore.set(key, { count: 1, firstRequestTime: now });
      }

      next();
    };

    // Attach middleware to route
    const existingMiddlewares: RequestHandler[] =
      Reflect.getMetadata(ROUTE_METADATA_KEY.MIDDLEWARES, descriptor.value) || [];
    existingMiddlewares.unshift(rateLimitMiddleware);
    Reflect.defineMetadata(ROUTE_METADATA_KEY.MIDDLEWARES, existingMiddlewares, descriptor.value);
  };
}

// Retrieve rate limit middleware from a route
export function getRateLimitMiddleware(target: any, propertyKey: string | symbol): RequestHandler[] {
  return Reflect.getMetadata(ROUTE_METADATA_KEY.MIDDLEWARES, target[propertyKey]) || [];
}
