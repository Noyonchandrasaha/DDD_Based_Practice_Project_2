// ============================================================================
// FILE: src/common/decorators/TooManyRequestsExceptions.ts
// ============================================================================

import { HttpStatus } from '../../core/enums/HttpStatus.enum';
import { BaseException } from './BaseException';
import { ERROR_MESSAGES } from '../constants/error-messages.constants';

export class TooManyRequestsException extends BaseException {
  constructor(message = ERROR_MESSAGES.TOO_MANY_REQUESTS, details?: Record<string, any>) {
    super(message, HttpStatus.TOO_MANY_REQUESTS, details);
  }
}