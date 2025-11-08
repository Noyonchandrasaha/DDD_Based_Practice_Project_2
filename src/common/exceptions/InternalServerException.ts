// ============================================================================
// FILE: src/common/decorators/InternalServerException.ts
// ============================================================================

import { HttpStatus } from '../../core/enums/HttpStatus.enum';
import { BaseException } from './BaseException';
import { ERROR_MESSAGES } from '../constants/error-messages.constants';

export class InternalServerException extends BaseException {
  constructor(message = ERROR_MESSAGES.INTERNAL_SERVER_ERROR, details?: Record<string, any>) {
    super(message, HttpStatus.INTERNAL_SERVER_ERROR, details);
  }
}