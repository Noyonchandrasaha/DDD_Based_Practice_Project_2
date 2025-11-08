// ============================================================================
// FILE: src/common/guards/AuthGuard.ts
// ============================================================================
import { Request, Response, NextFunction, RequestHandler } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Role } from "../../core/enums/Role.enum";
import { HttpStatus } from "../../core/enums/HttpStatus.enum";
import { Environment } from '../../core/enums/Environment.enum';
import { ERROR_MESSAGES } from '../constants/error-messages.constants';
import { ResponseHandler } from '../utils/ResponseHandler.util';
import { createAppConfig } from '../../config';
import { env } from '../../config/EnvLoader';


export class AuthGuard {
  static appConfig = createAppConfig(env);

  static authorize(allowedRoles?: Role[]): RequestHandler {
    return (req: Request, res: Response, next: NextFunction): void => {
      try {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith("Bearer ")) {
          ResponseHandler.error(
            res,
            {code:"TOKEN_MISSING" },
            ERROR_MESSAGES.UNAUTHORIZED,
            HttpStatus.UNAUTHORIZED
          );
          return;
        }

        const token = authHeader.split(" ")[1];
        const secret = process.env.JWT_SECRET;
        if (!secret) throw new Error("JWT_SECRET not configured");

        const decoded = jwt.verify(token, secret) as JwtPayload & {
          id?: string;
          role?: Role;
        };

        if (!decoded?.id) {
          ResponseHandler.error(
            res,
            {code: "TOKEN_INVALID"},
            ERROR_MESSAGES.TOKEN_INVALID,
            HttpStatus.UNAUTHORIZED
          )
          return;
        }

        (req as any).user = {
          id: decoded.id,
          role: decoded.role ?? Role.USER,
        };

        if (allowedRoles?.length) {
          const userRole = decoded.role ?? Role.USER;
          if (!allowedRoles.includes(userRole)) {
            ResponseHandler.error(
              res,
              {code:"ACCESS_DENIED"},
              ERROR_MESSAGES.FORBIDDEN,
              HttpStatus.FORBIDDEN
            )
            return;
          }
        }

        next();
      } catch (err: any) {
        
        ResponseHandler.error(
          res,
          {
            code: "AUTH_ERROR",
            stack: this.appConfig.env === Environment.DEVELOPMENT ? err.stack : undefined
          },
          ERROR_MESSAGES.AUTHENTICATION_FAILED,
          HttpStatus.UNAUTHORIZED
        )
      }
    };
  }
}
