// ============================================================================
// FILE: src/common/filters/HttpExceptionFilter.ts
// ============================================================================
import { Request, Response, NextFunction } from 'express';
import { HttpStatus } from '../../core/enums/HttpStatus.enum';
import { ApiResponse } from '../../core/types/ApiResponse.type';
import { ERROR_MESSAGES } from '../constants/error-messages.constants';
import { DateHelper } from '../utils/DateHelper.util';
import { ValidationException } from '../exceptions/ValidationException'; // ✅ Import

export class HttpExceptionFilter {
  public static handle(err: any, _req: Request, res: Response, _next: NextFunction): void {
    // ✅ Handle ValidationException specifically
    if (err instanceof ValidationException) {
      const response: ApiResponse<null> = {
        success: false,
        message: err.message,
        error: err.errors, // ✅ Use "errors" (plural) with validation errors
        timestamp: DateHelper.toDateTimeString(),
      };
      res.status(err.statusCode).json(response);
      return;
    }

    // Handle other exceptions
    const status = err.status || err.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
    const message = err.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR;

    const response: ApiResponse<null> = {
      success: false,
      message,
      error: err.details || err.error || null, // ✅ Use "error" (singular) for non-validation errors
      timestamp: DateHelper.toDateTimeString(),
    };

    res.status(status).json(response);
  }

  public static execute() {
    return this.handle;
  }
}

export const CatchAsync = (fn: Function) => (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise.resolve(fn(req, res, next)).catch(next);