// ============================================================================
// FILE: src/config/Logger.config.ts
// ============================================================================

import type { Env } from './Environment.config';

export const createLoggerConfig = (env: Env) => ({
  level: env.LOG_LEVEL,
  format: 'json',
  errorFile: 'logs/error.log',
  combinedFile: 'logs/combined.log',
});