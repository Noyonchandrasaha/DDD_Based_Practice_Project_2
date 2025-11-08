// ============================================================================
// FILE: src/infrastructure/database/prisma/PrismaClient.singleton.ts
// ============================================================================

import { PrismaClient } from '../../../../generated/prisma';
import { ILogger } from '../../../core/interfaces/ILogger';

export class PrismaClientSingleton {
  private static instance: PrismaClient | null = null;
  private static logger?: ILogger;

  static getInstance(logger?: ILogger): PrismaClient {
    if (!this.instance) {
      this.logger = logger;

      this.instance = new PrismaClient({
        log: [
          { emit: 'event', level: 'query' },
          { emit: 'event', level: 'error' },
          { emit: 'event', level: 'warn' },
        ],
      });

      this.registerEventHandlers(this.instance);

      this.logger?.info('Prisma Client initialized');
    }

    return this.instance;
  }

  private static registerEventHandlers(client: PrismaClient): void {
    if (process.env.NODE_ENV === 'development') {
      // Query logging (for dev only)
      client.$on('query' as never, (e: any) => {
        this.logger?.debug('🧩 Prisma Query', { 
          query: e.query, 
          params: e.params,
          duration: e.duration 
        });
      });
    }

    // Error logging
    client.$on('error' as never, (e: any) => {
      const error = new Error(e.message);
      if (e.code) (error as any).code = e.code;
      if (e.meta) (error as any).meta = e.meta;
      
      this.logger?.error(
        'Prisma Error', 
        error,
        { 
          code: e.code,
          meta: e.meta 
        } 
      );
    });

    // Warning logging
    client.$on('warn' as never, (e: any) => {
      this.logger?.warn('Prisma Warning', { 
        message: e.message 
      });
    });
  }

   // Disconnect the Prisma client gracefully.
  static async disconnect(): Promise<void> {
    if (this.instance) {
      await this.instance.$disconnect();
      this.instance = null;
      this.logger?.info('Prisma Client disconnected');
    }
  }
}