// ============================================================================
// FILE: src/config/Security.config.ts
// ============================================================================
import type { Env } from './Environment.config';


export const createSecurityConfig = (env: Env) => ({
  jwt: {
    secret: env.JWT_SECRET,
    expiresIn: env.JWT_EXPIRES_IN,
    refreshSecret: env.JWT_REFRESH_SECRET,
    refreshExpiresIn: env.JWT_REFRESH_EXPIRES_IN,
  },
});