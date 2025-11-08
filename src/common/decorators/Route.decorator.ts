// ============================================================================
// FILE: src/common/decorators/Route.decorator.ts
// ============================================================================

import 'reflect-metadata';
import { RequestHandler } from 'express';

export const ROUTE_METADATA_KEY = {
  PATH: 'route:path',
  METHOD: 'route:method',
  MIDDLEWARES: 'route:middlewares',
};

export type HttpMethod = 'get' | 'post' | 'put' | 'delete' | 'patch' | 'options' | 'head';

export interface RouteMetadata {
  method?: HttpMethod;
  path?: string;
  middlewares?: RequestHandler[];
}

export function Route(
  method: HttpMethod,
  path: string,
  middlewares: RequestHandler[] = []
): MethodDecorator {
  return (_target: Object, _propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
    Reflect.defineMetadata(ROUTE_METADATA_KEY.PATH, path, descriptor.value);
    Reflect.defineMetadata(ROUTE_METADATA_KEY.METHOD, method, descriptor.value);
    Reflect.defineMetadata(ROUTE_METADATA_KEY.MIDDLEWARES, middlewares, descriptor.value);
  };
}

export function getRouteMetadata(target: any, propertyKey: string | symbol): RouteMetadata {
  const method = Reflect.getMetadata(ROUTE_METADATA_KEY.METHOD, target[propertyKey]) as HttpMethod;
  const path = Reflect.getMetadata(ROUTE_METADATA_KEY.PATH, target[propertyKey]) as string;
  const middlewares = Reflect.getMetadata(ROUTE_METADATA_KEY.MIDDLEWARES, target[propertyKey]) as RequestHandler[];

  return { method, path, middlewares };
}
