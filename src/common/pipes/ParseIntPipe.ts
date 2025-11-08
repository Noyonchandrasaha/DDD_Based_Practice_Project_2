// ============================================================================
// FILE: src/common/pipes/ParseIntPipe.ts
// ============================================================================

import { Request, Response, NextFunction } from 'express';
import { BadRequestException } from '../exceptions/BadRequestException';


export class ParseIntPipe {
  constructor(private readonly paramName: string) {}

  public transform = (req: Request, _res: Response, next: NextFunction): void => {
    // Look for the value in params, query, or body
    const value =
      req.params[this.paramName] ??
      req.query[this.paramName] ??
      (req.body && req.body[this.paramName]);

    if (value === undefined || value === null) {
      throw new BadRequestException(`Missing parameter: ${this.paramName}`);
    }

    const parsedValue = Number(value);

    if (isNaN(parsedValue)) {
      throw new BadRequestException(`Invalid number provided for parameter: ${this.paramName}`);
    }

    if (!req.parsedParams) req.parsedParams = {};
    req.parsedParams[this.paramName] = parsedValue;

    next();
  };
}

// Extend Request type to include parsedParams
declare global {
  namespace Express {
    interface Request {
      parsedParams?: Record<string, number>;
    }
  }
}
