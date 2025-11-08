// ============================================================================
// FILE: src/common/middlewares/RateLimiter.middleware.ts
// ============================================================================

import { Request, Response, NextFunction } from 'express';
import rateLimit, { RateLimitRequestHandler } from 'express-rate-limit';
import { BaseMiddleware } from '../../core/abstracts/BaseMiddleware';
import { HttpStatus } from '../../core/enums/HttpStatus.enum';
import { ERROR_MESSAGES } from '../constants/error-messages.constants';
import { DateHelper } from '../utils/DateHelper.util';
import { ApiResponse } from '../../core/types/ApiResponse.type';

export interface RateLimiterOptions {
  windowMs?: number;   
  max?: number;         
  message?: string;    
}

export type RateLimiterType = 'api' | 'auth' | 'sensitive';

const DEFAULT_CONFIG: Record<RateLimiterType, RateLimiterOptions> = {
  api: {
    windowMs: 60 * 1000, // 1 minute
    max: 100,
    message: ERROR_MESSAGES.API_RATE_LIMIT,
  },
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5,
    message: ERROR_MESSAGES.SIGNUP_LOGIN_RATE_LIMIT,
  },
  sensitive: {
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 10,
    message: ERROR_MESSAGES.SENSITIVE_API_RATE_LIMIT,
  },
};

export class RateLimiterMiddleware extends BaseMiddleware {
  private limiter: RateLimitRequestHandler;

  constructor(
    type: RateLimiterType = 'api',
    customOptions?: RateLimiterOptions,
    logger?: any
  ) {
    super(logger);

    const config = { ...DEFAULT_CONFIG[type], ...customOptions };

    this.limiter = rateLimit({
      windowMs: config.windowMs,
      max: config.max,
      standardHeaders: true,
      legacyHeaders: false,
      handler: (req: Request, res: Response) => {
        this.logger?.warn('Rate limit exceeded', {
          ip: req.ip,
          url: req.originalUrl,
          type,
        });

        const response: ApiResponse = {
          success: false,
          message: config.message ?? ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
          error:{},
          timestamp: DateHelper.toDateTimeString(),
        }

        res.status(HttpStatus.TOO_MANY_REQUESTS).json(response);
      },
    });
  }

  public async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    return new Promise((resolve, reject) => {
      this.limiter(req, res, (err) => {
        if (err) return reject(err);
        next();
        resolve();
      });
    });
  }
}
