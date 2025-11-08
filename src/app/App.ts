// ============================================================================
// FILE: src/app/App.ts
// ============================================================================
import express, { Application } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import { AppRoutes } from '../routes';
import { ValidationFilter } from '../common/filters/ValidationFilter';
import { HttpExceptionFilter } from '../common/filters/HttpExceptionFilter';
import { LoggerMiddleware } from '../common/middlewares/Logger.middleware';
import { RequestIdMiddleware } from '../common/middlewares/RequestId.middleware';
import { RateLimiterMiddleware } from '../common/middlewares/RateLimiter.middleware';
import { TimeoutMiddleware } from '../common/middlewares/Timeout.middleware';
import { SanitationPipe } from '../common/pipes/SanitizationPipe';
import { ILogger } from '../core/interfaces/ILogger';
import { AppConfig } from '../config';

export class App {
  public app: Application;
  private logger: ILogger;
  private routes: AppRoutes;

  constructor(routes: AppRoutes, logger: ILogger) {
    this.app = express();
    this.logger = logger;
    this.routes = routes;

    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddlewares(): void {
    // === SECURITY & PERFORMANCE ===
    this.app.use(helmet());
    this.app.use(cors({ origin: AppConfig.corsOrigin, credentials: true }));
    this.app.use(compression());

    // === REQUEST TRACING ===
    this.app.use(new RequestIdMiddleware().execute());

    // === LOGGING ===
    this.app.use(new LoggerMiddleware(this.logger).execute());

    // === SANITIZATION (BEFORE PARSING) ===
    this.app.use(SanitationPipe({ target: 'body' }));
    // this.app.use(SanitationPipe({ target: 'query' }));

    // === PARSING ===
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // === PROTECTION ===
    this.app.use(new RateLimiterMiddleware('api').execute());
    this.app.use(new TimeoutMiddleware(15000).execute()); // 15s
  }

  private initializeRoutes(): void {
    this.app.use(this.routes.router);
  }

  private initializeErrorHandling(): void {
    // Use .execute() for consistency
    this.app.use(ValidationFilter.execute());
    this.app.use(HttpExceptionFilter.execute());
  }

  public listen(): void {
    const server = this.app.listen(AppConfig.port, () => { 
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      this.logger.warn('SIGTERM received. Shutting down...');
      server.close(() => {
        this.logger.info('Server closed.');
        process.exit(0);
      });
    });
  }
}