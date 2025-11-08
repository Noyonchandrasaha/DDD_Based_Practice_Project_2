// ============================================================================
// FILE: src/common/exceptions/BadRequestException.ts
// ============================================================================

import { HttpStatus } from '../../core/enums/HttpStatus.enum';
import { BaseException } from './BaseException';

export class BadRequestException extends BaseException {
  constructor(message = 'Bad Request', details?: Record<string, any>) {
    super(message, HttpStatus.BAD_REQUEST, details);
  }
}