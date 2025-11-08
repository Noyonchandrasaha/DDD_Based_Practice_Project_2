// ============================================================================
// FILE: src/config/EnvLoader.ts
// ============================================================================
import 'dotenv/config';
import { validateEnv, type Env } from './Environment.config';

export const env: Env = validateEnv();
