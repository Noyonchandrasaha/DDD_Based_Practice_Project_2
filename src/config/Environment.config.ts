// ============================================================================
// FILE: src/config/Environment.config.ts
// ============================================================================

import { cleanEnv, str, port, url, num } from 'envalid';
import { Environment } from '../core/enums/Environment.enum';
import { LogLevel } from '../core/enums/LogLevel.enum';

export const validateEnv = () => {
  return cleanEnv(process.env, {
    // === App ===
    NODE_ENV: str({
      choices: [Environment.DEVELOPMENT, Environment.PRODUCTION, Environment.TEST] as const,
      default: Environment.DEVELOPMENT,
    }),
    PORT: port({ default: 5000 }),

    APP_NAME: str({ default: 'MyApp' }),
    APP_VERSION: str({ default: '1.0.0' }),

    // === Database ===
    DATABASE_URL: url(),

    // === Cache ===
    CACHE_STRATEGY: str({
      choices: ['memory', 'redis'] as const,
      default: 'memory',
    }),
    REDIS_URL: str(), 

    // === Auth ===
    JWT_SECRET: str(), 
    JWT_EXPIRES_IN: str({ default: '7d' }),
    JWT_REFRESH_SECRET: str(), 
    JWT_REFRESH_EXPIRES_IN: str({ default: '30d' }),

    // === CORS ===
    CORS_ORIGIN: str({ default: 'http://localhost:3000' }),

    // === Rate Limiting ===
    RATE_LIMIT_WINDOW_MS: num({ default: 60_000 }),
    RATE_LIMIT_MAX: num({ default: 100 }),

    // === Logging ===
    LOG_LEVEL: str({
      choices: [LogLevel.ERROR, LogLevel.WARN, LogLevel.INFO, LogLevel.DEBUG] as const,
      default: LogLevel.INFO,
    }),
  });
};

export type Env = ReturnType<typeof validateEnv>;