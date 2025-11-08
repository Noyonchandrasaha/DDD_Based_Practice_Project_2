// ============================================================================
// FILE: src/common/decorators/Validator.decorator.ts
// ============================================================================

import 'reflect-metadata';
import { RequestHandler } from 'express';
import { ROUTE_METADATA_KEY } from './Route.decorator';
import { ZodType } from 'zod';
import { BaseValidator } from '../../core/abstracts/BaseValidator';


// Options for Validator decorator
export interface ValidatorOptions<T = any> {
  schema: ZodType<T>;           // ZodType to validate request data
  validator?: BaseValidator;    // Optional custom validator instance
}

//
// Validator decorator
// Attaches validation middleware to a route
// Usage:
// @Validator({ schema: MyZodSchema })
// @Route('post', '/create')
export function Validator<T = any>(options: ValidatorOptions<T>): MethodDecorator {
  return (_target: Object, _propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
    const validatorInstance = options.validator || new (class extends BaseValidator {})();

    const validationMiddleware: RequestHandler = validatorInstance.validate(options.schema);

    // Retrieve existing middlewares
    const existingMiddlewares: RequestHandler[] =
      Reflect.getMetadata(ROUTE_METADATA_KEY.MIDDLEWARES, descriptor.value) || [];

    // Attach validation middleware to the beginning (runs first)
    existingMiddlewares.unshift(validationMiddleware);

    // Save updated middleware list in route metadata
    Reflect.defineMetadata(ROUTE_METADATA_KEY.MIDDLEWARES, existingMiddlewares, descriptor.value);
  };
}


// Retrieve validation middleware from a route
export function getValidatorMiddleware(target: any, propertyKey: string | symbol): RequestHandler[] {
  return Reflect.getMetadata(ROUTE_METADATA_KEY.MIDDLEWARES, target[propertyKey]) || [];
}
