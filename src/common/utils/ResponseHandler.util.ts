// ============================================================================
// FILE: src/common/utils/ResponseHandler.util.ts
// ============================================================================

import { Response } from 'express';
import { ApiResponse, StructuredError } from '../../core/types/ApiResponse.type';
import { HttpStatus } from '../../core/enums/HttpStatus.enum';
import { DateHelper } from '../utils/DateHelper.util';

export class ResponseHandler {
  public static success<T>(res: Response, data: T, message = 'Request successful', statusCode=HttpStatus.OK): Response<ApiResponse<T>> {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      timestamp: DateHelper.toDateTimeString(),
    });
  }

  public static error<E = StructuredError>(
    res: Response,
    error: E,
    message = 'Something went wrong',
    statusCode = HttpStatus.BAD_REQUEST
  ): Response<ApiResponse<null, E>> {
    return res.status(statusCode).json({
      success: false,
      message,
      error,
      timestamp: DateHelper.toDateTimeString(),
    });
  }
}
