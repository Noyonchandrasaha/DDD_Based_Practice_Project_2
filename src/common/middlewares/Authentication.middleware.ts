// ============================================================================
// FILE: src/common/middlewares/Authentication.middleware.ts
// ============================================================================

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { BaseMiddleware } from '../../core/abstracts/BaseMiddleware';
import { ILogger } from '../../core/interfaces/ILogger';
import { UnauthorizedException } from '../exceptions/UnauthorizedException';

export interface AuthMiddlewareOptions {
  logger?: ILogger;
  jwtSecret: string;
  tokenPrefix?: string; 
}


export class AuthenticationMiddleware extends BaseMiddleware {
  private jwtSecret: string;
  private tokenPrefix: string;

  constructor(options: AuthMiddlewareOptions) {
    super(options.logger);
    this.jwtSecret = options.jwtSecret;
    this.tokenPrefix = options.tokenPrefix || 'Bearer';
  }

  public async handle(req: Request, _res: Response, next: NextFunction): Promise<void> {
    try {
      const authHeader = req.headers['authorization'];
      if (!authHeader) {
        throw new UnauthorizedException('Authorization header missing');
      }

      const [prefix, token] = authHeader.split(' ');

      if (!token || prefix !== this.tokenPrefix) {
        throw new UnauthorizedException('Invalid token format');
      }

      // Verify JWT
      const decoded = jwt.verify(token, this.jwtSecret) as Record<string, any>;

      // Attach user info to request
      (req as any).user = decoded;

      next();
    } catch (err: unknown) {
      this.logger?.error('Authentication failed', undefined ,{ error: err instanceof Error ? err : undefined });

      if (err instanceof jwt.JsonWebTokenError) {
        next(new UnauthorizedException('Invalid or expired token'));
        return;
      }

      if (err instanceof UnauthorizedException) {
        next(err);
        return;
      }

      next(new UnauthorizedException('Authentication middleware failed'));
    }
  }
}
