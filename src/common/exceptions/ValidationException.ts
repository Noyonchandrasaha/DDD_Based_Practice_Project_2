// ============================================================================
// FILE: src/common/exceptions/ValidationException.ts
// ============================================================================
import { HttpStatus } from '../../core/enums/HttpStatus.enum';
import { BaseException } from './BaseException';
import { ERROR_MESSAGES } from '../constants/error-messages.constants';

export class ValidationException extends BaseException {
  constructor(
    message: string = ERROR_MESSAGES.VALIDATION_FAILED, 
    public readonly errors: Record<string, string> = {}
  ) {
    super(message, HttpStatus.BAD_REQUEST, { errors });
    this.name = 'ValidationException';
  }

  // ✅ Add this method to ensure proper serialization
  toJSON() {
    return {
      success: false,
      message: this.message,
      errors: this.errors, // ✅ Use "errors" (plural)
      timestamp: this.timestamp
    };
  }
}