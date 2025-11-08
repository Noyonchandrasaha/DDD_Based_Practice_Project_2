// ============================================================================
// FILE: src/infrastructure/database/prisma/PrismaService.ts
// ============================================================================

import { PrismaClient } from '../../../../generated/prisma';
import { PrismaClientSingleton } from './PrismaClient.singleton';
import { ILogger } from '../../../core/interfaces/ILogger';

export class PrismaService {
  private client: PrismaClient;

  constructor(logger?: ILogger) {
    this.client = PrismaClientSingleton.getInstance(logger);
  }

  get prisma(): PrismaClient {
    return this.client;
  }

  async connect(): Promise<void> {
    await this.client.$connect();
  }

  async disconnect(): Promise<void> {
    await PrismaClientSingleton.disconnect();
  }

  async healthCheck(): Promise<boolean> {
    try {
      await this.client.$runCommandRaw({ ping: 1 });
      return true;
    } catch (error) {
      return false;
    }
  }
}
