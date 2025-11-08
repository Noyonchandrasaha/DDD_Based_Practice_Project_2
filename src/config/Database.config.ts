// ============================================================================
// FILE: src/config/Database.config.ts
// ============================================================================
import type { Env } from './Environment.config';

export const createDatabaseConfig = (env: Env) => ({
  url: env.DATABASE_URL,
});