// ============================================================================
// FILE: src/common/decorators/UnauthorizedException.ts
// ============================================================================

import { HttpStatus } from '../../core/enums/HttpStatus.enum';
import { BaseException } from './BaseException';
import { ERROR_MESSAGES } from '../constants/error-messages.constants';

export class UnauthorizedException extends BaseException {
  constructor(message = ERROR_MESSAGES.UNAUTHORIZED, details?: Record<string, any>) {
    super(message, HttpStatus.UNAUTHORIZED, details);
  }
}