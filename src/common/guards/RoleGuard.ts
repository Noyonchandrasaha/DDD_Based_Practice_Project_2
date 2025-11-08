// ============================================================================
// FILE: src/common/guards/RoleGuard.ts
// ============================================================================
import { Request, Response, NextFunction, RequestHandler } from "express";
import { Role } from "../../core/enums/Role.enum";
import { HttpStatus } from "../../core/enums/HttpStatus.enum";
import { Environment } from '../../core/enums/Environment.enum';
import { ERROR_MESSAGES } from '../constants/error-messages.constants';
import { ResponseHandler } from '../utils/ResponseHandler.util';
import { createAppConfig } from '../../config';
import { env } from '../../config/EnvLoader';

export class RoleGuard {

  static appConfig = createAppConfig(env);

  static allow(allowedRoles: Role[]): RequestHandler {
    return (req: Request, res: Response, next: NextFunction): void => {
      try {
        const user = (req as any).user;

        if (!user || !user.role) {
          ResponseHandler.error(
            res,
            {code: "UNAUTHORIZED_USER"},
            ERROR_MESSAGES.UNAUTHORIZED,
            HttpStatus.UNAUTHORIZED
          )
          return;
        }

        const hasAccess = allowedRoles.includes(user.role);
        if (!hasAccess) {
          ResponseHandler.error(
            res,
            {code: "ROLE_FORBIDDEN"},
            ERROR_MESSAGES.FORBIDDEN,
            HttpStatus.FORBIDDEN
          )
          return;
        }

        next();
      } catch (err: any) {
        ResponseHandler.error(
          res,
          {
            code:"ROLE_GURD_ERROR",
            stack:
            this.appConfig.env == Environment.DEVELOPMENT ? err.stack : undefined,
          },
          ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
          HttpStatus.INTERNAL_SERVER_ERROR
        )
      }
    };
  }
}
