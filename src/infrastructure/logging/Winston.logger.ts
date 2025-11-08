// ============================================================================
// FILE: src/infrastructure/logging/Winston.logger.ts
// ============================================================================

import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import dayjs from 'dayjs';
import { ILogger } from '../../core/interfaces/ILogger';
import { env } from '../../config/EnvLoader';
import { MISC } from '../../common/constants/app.constants'

export class WinstonLogger implements ILogger {
  private logger: winston.Logger;

  constructor() {
    const isProd = env.NODE_ENV === 'production';

    this.logger = winston.createLogger({
      level: isProd ? 'info' : 'debug',
      format: winston.format.combine(
        winston.format.timestamp({ format: MISC.DATE_FORMAT}),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        winston.format.json()
      ),
      defaultMeta: {
        service: env.APP_NAME,
        version: env.APP_VERSION,
      },
      transports: [
        // Error logs → rotated daily
        new DailyRotateFile({
          filename: 'logs/error-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          level: 'error',
          maxSize: '20m',
          maxFiles: '14d',
          zippedArchive: true,
        }),
        // All logs → rotated daily
        new DailyRotateFile({
          filename: 'logs/combined-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          maxSize: '50m',
          maxFiles: '30d',
          zippedArchive: true,
        }),
      ],
    });

    // Console logging for non-production
    if (!isProd) {
      this.logger.add(
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.printf(({ level, message, timestamp, ...meta }) => {
              return `[${timestamp}] ${level}: ${message} ${
                Object.keys(meta).length ? JSON.stringify(meta) : ''
              }`;
            })
          ),
        })
      );
    }
  }

  // ------------------------------------------------------------
  // Unified logging methods (match ILogger exactly)
  // ------------------------------------------------------------

  log<TMeta = Record<string, any>>(
    level: string,
    message: string,
    meta?: TMeta,
    context?: Record<string, any>
  ): void {
    this.logger.log(level, message, {
      timestamp: dayjs().format(MISC.DATE_FORMAT),
      ...(meta || {}),
      ...(context || {}),
    });
  }

  info<TMeta = Record<string, any>>(message: string, meta?: TMeta, context?: Record<string, any>): void {
    this.log('info', message, meta, context);
  }

  warn<TMeta = Record<string, any>>(message: string, meta?: TMeta, context?: Record<string, any>): void {
    this.log('warn', message, meta, context);
  }

  debug<TMeta = Record<string, any>>(message: string, meta?: TMeta, context?: Record<string, any>): void {
    this.log('debug', message, meta, context);
  }

  error(message: string, error?: Error, meta?: Record<string, any>, context?: Record<string, any>): void {
    const errorInfo =
      error instanceof Error
        ? { name: error.name, message: error.message, stack: error.stack }
        : { error };

    this.log('error', message, { ...errorInfo, ...(meta || {}) }, context);
  }
}
