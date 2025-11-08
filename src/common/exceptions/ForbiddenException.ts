// ============================================================================
// FILE: src/common/decorators/ForbiddenException.ts
// ============================================================================

import { HttpStatus } from '../../core/enums/HttpStatus.enum';
import { BaseException } from './BaseException';
import { ERROR_MESSAGES } from '../constants/error-messages.constants';

export class ForbiddenException extends BaseException {
  constructor(message = ERROR_MESSAGES.FORBIDDEN, details?: Record<string, any>) {
    super(message, HttpStatus.FORBIDDEN, details);
  }
}