// ============================================================================
// FILE: src/config/App.config.ts
// ============================================================================
import type { Env } from './Environment.config';


export const createAppConfig = (env: Env) => ({
  name: env.APP_NAME,
  version: env.APP_VERSION,
  env: env.NODE_ENV,
  port: env.PORT,
  corsOrigin: env.CORS_ORIGIN,
});