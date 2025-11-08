// ============================================================================
// FILE: src/common/filters/ValidationFilter.ts
// ============================================================================

import { Request, Response, NextFunction } from 'express';
import { BaseException } from '../exceptions/BaseException';
import { ValidationException } from '../exceptions/ValidationException';
import { ApiResponse } from '../../core/types/ApiResponse.type';
import { HttpStatus } from '../../core/enums/HttpStatus.enum';
import { ERROR_MESSAGES } from '../constants/error-messages.constants';
import { DateHelper } from '../utils/DateHelper.util';

export class ValidationFilter {
  public static handle(
    err: any,
    _req: Request,
    res: Response,
    _next: NextFunction
  ): void {
    let response: ApiResponse;

    if (err instanceof ValidationException) {
      response = {
        success: false,
        message: err.message,
        error: err.details ?? { code: err.name },
        timestamp: err.timestamp,
      };
      res.status(HttpStatus.BAD_REQUEST).json(response);
      return;
    }

    if (err instanceof BaseException) {
      response = {
        success: false,
        message: err.message,
        error: err.details ?? { code: err.name },
        timestamp: err.timestamp,
      };
      res.status(err.statusCode).json(response);
      return;
    }

    response = {
      success: false,
      message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
      error: { code: 'INTERNAL_SERVER_ERROR' },
      timestamp: DateHelper.toDateTimeString(),
    };
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(response);
  }

  // .execute() wrapper
  public static execute() {
    return this.handle;
  }
}