// ============================================================================
// FILE: src/core/interfaces/IValidator.ts
// ============================================================================

import { RequestHandler } from 'express';
import { ZodType } from 'zod';

export interface IValidator {
  validate<T extends ZodType<any>>(
    schema: T,
    options?: { 
      target?: 'body' | 'query' | 'params'; 
      abortEarly?: boolean; 
    }
  ): RequestHandler;
}
