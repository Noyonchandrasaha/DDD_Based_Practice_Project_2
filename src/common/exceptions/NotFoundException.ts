// ============================================================================
// FILE: src/common/decorators/NotFoundException.ts
// ============================================================================

import { HttpStatus } from '../../core/enums/HttpStatus.enum';
import { BaseException } from './BaseException';
import { ERROR_MESSAGES } from '../constants/error-messages.constants';

export class NotFoundException extends BaseException {
  constructor(message = ERROR_MESSAGES.NOT_FOUND, details?: Record<string, any>) {
    super(message, HttpStatus.NOT_FOUND, details);
  }
}