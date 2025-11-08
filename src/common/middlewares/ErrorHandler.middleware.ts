// ============================================================================
// FILE: src/common/middlewares/ErrorHandler.middleware.ts
// ============================================================================

import { Request, Response, NextFunction } from 'express';
import { ErrorHandlerMiddleware } from '../../core/abstracts/BaseMiddleware';
import { BaseException } from '../exceptions/BaseException';
import { HttpStatus } from '../../core/enums/HttpStatus.enum';
import { ERROR_MESSAGES } from '../constants/error-messages.constants';
import { DateHelper } from '../utils/DateHelper.util';
import { ApiResponse } from '../../core/types/ApiResponse.type';

export class AppErrorHandler extends ErrorHandlerMiddleware {
  public handle(
    err: any,
    _req: Request,
    res: Response,
    _next: NextFunction
  ): void {
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let code = 'INTERNAL_ERROR';
    let message = ERROR_MESSAGES.INTERNAL_SERVER_ERROR;
    let details: Record<string, any> = {};

    if (err instanceof BaseException) {
      status = err.statusCode;
      code = err.name;
      message = err.message;
      details = err.details || {};
    } else if (err.name === 'ZodError') {
      status = HttpStatus.BAD_REQUEST;
      code = 'VALIDATION_ERROR';
      message = ERROR_MESSAGES.VALIDATION_FAILED;
      details = { issues: err.issues };
    }

    this.logger.error(
      'Unhandled Exception',
      err instanceof Error ? err : undefined, 
      { status, code, details }               
    );

    const fields =
      Array.isArray(details?.issues)
        ? Object.fromEntries(
            details.issues.map((i: any) => [i.path?.join('.') ?? 'unknown', i.message])
          )
        : (details as Record<string, string>);

    const response: ApiResponse = {
      success: false,
      message,
      error : {
        code, 
        fields 
      },
      timestamp: DateHelper.toDateTimeString(),
    }

    res.status(status).json(response);
  }
}