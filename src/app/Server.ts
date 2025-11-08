// ============================================================================
// FILE: src/app/Server.ts
// ============================================================================
import { App } from './App';
import { PrismaService } from '../infrastructure/database/prisma/PrismaService';
import { WinstonLogger } from '../infrastructure/logging/Winston.logger';
import { V1Routes } from '../routes/v1';
import { AppRoutes } from '../routes';
import { AppConfig } from '../config';


export class Server {
  private app: App;
  private prismaService: PrismaService;
  private readonly logger = new WinstonLogger();

  constructor() {
    this.prismaService = new PrismaService(this.logger);
    this.app = this.initializeApp();
  }

  private initializeApp(): App {
    const v1Routes = new V1Routes(this.prismaService); 
    const appRoutes = new AppRoutes(v1Routes);
    return new App(appRoutes, this.logger);
  }

  public async start(): Promise<void> {
    try {
      const port = Number(AppConfig.port);
      if (isNaN(port) || port < 1 || port > 65535) {
        throw new Error(`Invalid port: ${AppConfig.port}`);
      }

      await this.prismaService.connect();
      this.logger.info('Database connected');
      this.app.listen();
      this.setupGracefulShutdown();
    } catch (error: unknown) {
      let err: Error;
      if (error instanceof Error) {
        err = error;
      } else {
        err = new Error(String(error));
      }

      this.logger.error(
        'Failed to start server',
        err,                    // Error object
        { attempt: 1 }          // metadata
      );
      process.exit(1);
    }
  }

  private setupGracefulShutdown(): void {
    const shutdown = async (signal: string) => {
      this.logger.warn(`${signal} received. Shutting down gracefully...`);

      try {
        await this.prismaService.disconnect();
        this.logger.info('Database disconnected');
      } catch (err: unknown) {
        let error: Error;
        if (err instanceof Error) {
          error = err;
        } else {
          error = new Error(String(err));
        }

        this.logger.error(
          'Error during shutdown',
          error,                  // Error object
          { signal }              // metadata
        );
      } finally {
        process.exit(0);
      }
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  }

  public getApp(): App {
    return this.app;
  }
}