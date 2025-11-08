// ============================================================================
// FILE: src/common/decorators/Authorized.decorator.ts
// ============================================================================

import 'reflect-metadata';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import { ROUTE_METADATA_KEY } from './Route.decorator';
import { Role } from '../../core/enums/Role.enum';
import { ERROR_MESSAGES } from '../constants/error-messages.constants';
import { ResponseHandler } from '../utils/ResponseHandler.util';
import { HttpStatus } from '../../core/enums/HttpStatus.enum';


// Extend Express Request to include user property
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    roles: Role[];
    [key: string]: any;
  };
}

// Options for the Authorized decorator
export interface AuthorizedOptions {
  roles?: Role[];              
  middleware?: RequestHandler; 
}


// Authorized decorator
// Adds authorization info or middleware to a route

export function Authorized(options: AuthorizedOptions = {}): MethodDecorator {
  return (_target: Object, _propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
    const existingMiddlewares: RequestHandler[] =
      Reflect.getMetadata(ROUTE_METADATA_KEY.MIDDLEWARES, descriptor.value) || [];

    if (options.middleware) {
      existingMiddlewares.push(options.middleware);
    }

    // Role-based middleware
    if (options.roles && options.roles.length > 0) {
      existingMiddlewares.push((req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        const userRoles: Role[] = req.user?.roles || [];
        const hasAccess = options.roles?.some(role => userRoles.includes(role));

        if (!hasAccess) {
          return ResponseHandler.error(
            res,
            {code: 'FORBIDDEN'},
            ERROR_MESSAGES.FORBIDDEN,
            HttpStatus.FORBIDDEN
          )
        }

        return next(); 
      });
    }

    // Attach updated middlewares to the route metadata
    Reflect.defineMetadata(ROUTE_METADATA_KEY.MIDDLEWARES, existingMiddlewares, descriptor.value);
  };
}

// Retrieve authorization middleware from a route
export function getAuthorizedMiddleware(target: any, propertyKey: string | symbol): RequestHandler[] {
  return Reflect.getMetadata(ROUTE_METADATA_KEY.MIDDLEWARES, target[propertyKey]) || [];
}
