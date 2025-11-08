// ============================================================================
// FILE: src/core/interfaces/ICache.ts
// ============================================================================

export interface ICache {
  get<T = any>(key: string): Promise<T | null>;
  set<T = any>(key: string, value: T, ttl?: number): Promise<void>;
  del(key: string): Promise<void>;
  has(key: string): Promise<boolean>;
  clear(): Promise<void>;
  mget<T = any>(keys: string[]): Promise<Record<string, T | null>>;
  mset<T = any>(items: Record<string, T>, ttl?: number): Promise<void>;
}
