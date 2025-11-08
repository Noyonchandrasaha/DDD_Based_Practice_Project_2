// ============================================================================
// FILE: src/infrastructure/cache/InMemoryCache.service.ts
// ============================================================================

import { ICache } from '../../../core/interfaces/ICache';

/**
 * Centralized In-Memory Cache Service
 * Used by decorators, interceptors, and services
 */
export class InMemoryCacheService implements ICache {
  private store = new Map<string, { data: any; expiry: number }>();

  async get<T = any>(key: string): Promise<T | null> {
    const cached = this.store.get(key);
    if (!cached) return null;
    
    if (cached.expiry < Date.now()) {
      this.store.delete(key);
      return null;
    }
    
    return cached.data as T;
  }

  async set<T = any>(key: string, value: T, ttl: number = 300): Promise<void> {
    this.store.set(key, {
      data: value,
      expiry: Date.now() + ttl * 1000
    });
  }

  async del(key: string): Promise<void> {
    this.store.delete(key);
  }

  async has(key: string): Promise<boolean> {
    const cached = this.store.get(key);
    if (!cached) return false;
    if (cached.expiry < Date.now()) {
      this.store.delete(key);
      return false;
    }
    return true;
  }

  async clear(): Promise<void> {
    this.store.clear();
  }

  async mget<T = any>(keys: string[]): Promise<Record<string, T | null>> {
    const result: Record<string, T | null> = {};
    for (const key of keys) {
      result[key] = await this.get<T>(key);
    }
    return result;
  }

  async mset<T = any>(items: Record<string, T>, ttl: number = 300): Promise<void> {
    for (const [key, value] of Object.entries(items)) {
      await this.set(key, value, ttl);
    }
  }
}

// Singleton instance
export const inMemoryCache = new InMemoryCacheService();
