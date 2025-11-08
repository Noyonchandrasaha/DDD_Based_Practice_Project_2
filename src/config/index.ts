// ============================================================================
// FILE: src/config/index.ts
// ============================================================================

import 'dotenv/config';
import { validateEnv, type Env } from './Environment.config';
import { createAppConfig } from './App.config';
import { createDatabaseConfig } from './Database.config';
import { createLoggerConfig } from './Logger.config';
import { createSecurityConfig } from './Security.config';
import { WinstonLogger } from '../infrastructure/logging/Winston.logger';
import { Environment } from '../core/enums/Environment.enum';

// === VALIDATE ENV FIRST ===
const env = validateEnv();
const logger = new WinstonLogger();

/* -------------------------------------------------------------------------- */
/*                     RUNTIME CONFIGURATION VALIDATION                       */
/* -------------------------------------------------------------------------- */

if (env.JWT_SECRET.length < 32) {
  logger.error('JWT_SECRET must be at least 32 characters long', undefined, {
    currentLength: env.JWT_SECRET.length,
  });
  process.exit(1);
}

if (env.JWT_REFRESH_SECRET && env.JWT_REFRESH_SECRET.length < 32) {
  logger.error('JWT_REFRESH_SECRET too short', undefined, {
    currentLength: env.JWT_REFRESH_SECRET.length,
  });
  process.exit(1);
}

if (env.CACHE_STRATEGY === 'redis' && !env.REDIS_URL) {
  logger.error('REDIS_URL required for redis cache', undefined, {
    cacheStrategy: env.CACHE_STRATEGY,
  });
  process.exit(1);
}

if (env.NODE_ENV === Environment.PRODUCTION && env.CORS_ORIGIN.includes('*')) {
  logger.warn('CORS_ORIGIN="*" in production is insecure');
}

/* -------------------------------------------------------------------------- */
/*                          CREATE CONFIGURATIONS                             */
/* -------------------------------------------------------------------------- */

// Create all config objects using the validated environment
const AppConfig = createAppConfig(env);
const DatabaseConfig = createDatabaseConfig(env);
const LoggerConfig = createLoggerConfig(env);
const SecurityConfig = createSecurityConfig(env);

/* -------------------------------------------------------------------------- */
/*                                EXPORTS                                     */
/* -------------------------------------------------------------------------- */

// Export the validated environment
export { env };
export type { Env };

// Export all config objects
export { AppConfig, DatabaseConfig, LoggerConfig, SecurityConfig };

// Export factory functions for testing
export { 
  createAppConfig, 
  createDatabaseConfig, 
  createLoggerConfig, 
  createSecurityConfig 
};
