// ============================================================================
// FILE: src/core/interfaces/ILogger.ts
// ============================================================================

import { LogLevel } from '../enums/LogLevel.enum';

export interface ILogger {
  log<TMeta = Record<string, any>>(
    level: LogLevel,
    message: string,
    meta?: TMeta,
    context?: Record<string, any>
  ): void | Promise<void>;

  info<TMeta = Record<string, any>>(
    message: string,
    meta?: TMeta,
    context?: Record<string, any>
  ): void | Promise<void>;

  warn<TMeta = Record<string, any>>(
    message: string,
    meta?: TMeta,
    context?: Record<string, any>
  ): void | Promise<void>;

  debug<TMeta = Record<string, any>>(
    message: string,
    meta?: TMeta,
    context?: Record<string, any>
  ): void | Promise<void>;

  error(
    message: string,
    error?: Error,
    meta?: Record<string, any>,
    context?: Record<string, any>
  ): void | Promise<void>;
}