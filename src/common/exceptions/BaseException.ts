// ============================================================================
// FILE: src/common/exceptions/BaseException.ts
// ============================================================================

import { HttpStatus } from '../../core/enums/HttpStatus.enum';
import { DateHelper } from '../utils/DateHelper.util';

export class BaseException extends Error {
  public readonly statusCode: HttpStatus;
  public readonly timestamp: string;
  public readonly details?: Record<string, any>;

  constructor(
    message: string,
    statusCode: HttpStatus,
    details?: Record<string, any>
  ) {
    super(message);

    this.statusCode = statusCode;
    this.timestamp = DateHelper.toDateTimeString();
    this.details = details;

    this.name = this.constructor.name;
    Error.captureStackTrace?.(this, this.constructor);
  }

  public toJSON(): Record<string, any> {
    return {
      code: this.name,
      message: this.message,
      statusCode: this.statusCode,
      timestamp: this.timestamp,
      ...(this.details && { fields: this.details }),
    };
  }
}