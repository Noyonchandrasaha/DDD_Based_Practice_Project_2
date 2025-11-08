// ============================================================================
// FILE: src/common/decorators/ConflictException.ts
// ============================================================================

import { HttpStatus } from '../../core/enums/HttpStatus.enum';
import { BaseException } from './BaseException';
import { ERROR_MESSAGES } from '../constants/error-messages.constants';

export class ConflictException extends BaseException {
  constructor(message = ERROR_MESSAGES.DUPLICATE_RECORD, details?: Record<string, any>) {
    super(message, HttpStatus.CONFLICT, details);
  }
}