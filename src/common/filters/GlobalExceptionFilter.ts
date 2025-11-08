// ============================================================================
// FILE: src/common/filters/GlobalExceptionFilter.ts
// ============================================================================
import { Request, Response, NextFunction } from 'express';
import { WinstonLogger } from '../../infrastructure/logging/Winston.logger';
import { BaseException } from '../exceptions/BaseException';
import { HttpStatus } from '../../core/enums/HttpStatus.enum';
import { ERROR_MESSAGES } from '../constants/error-messages.constants';
import { DateHelper } from '../utils/DateHelper.util';

const logger = new WinstonLogger();

export const GlobalExceptionFilter = (
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const requestId = (req as any).requestId || 'unknown';

  // Default values
  let status = HttpStatus.INTERNAL_SERVER_ERROR;
  let errorCode = 'INTERNAL_SERVER_ERROR';
  let message = ERROR_MESSAGES.INTERNAL_SERVER_ERROR;
  let details: Record<string, any> = {};

  // === Custom Exceptions (from BaseException) ===
  if (err instanceof BaseException) {
    status = err.statusCode;
    errorCode = err.name;
    message = err.message;
    details = err.details || {};
  }

  // === Validation Errors (Zod, Joi, etc.) ===
  else if (err.name === 'ValidationError' || err.name === 'ZodError') {
    status = HttpStatus.BAD_REQUEST;
    errorCode = 'VALIDATION_ERROR';
    message = ERROR_MESSAGES.VALIDATION_FAILED;
    details = { errors: err.errors || err.issues };
  }

  // === Prisma Errors ===
  else if (err.code?.startsWith?.('P')) {
    status = HttpStatus.BAD_REQUEST;
    errorCode = 'DATABASE_ERROR';
    message = ERROR_MESSAGES.DATABASE_CONNECTION_ERROR;
    details = { prismaCode: err.code, meta: err.meta };
  }

  // === Unknown Errors (fallback) ===
  else {
    // Ensure error is serializable
    details = {
      name: err.name || 'UnknownError',
      message: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    };
  }

  // === Logging ===
  logger.error(`[${requestId}] ${message}`, err, {
    status,
    errorCode,
    method: req.method,
    path: req.path,
    details,
  });

  // === Response ===
  res.status(status).json({
    success: false,
    message,
    error: { code: errorCode, details },
    timestamp: DateHelper.toDateTimeString(),
    requestId,
  });
};
