// ============================================================================
// FILE: src/index.ts
// ============================================================================

import 'dotenv/config';
import 'reflect-metadata';
import { Server } from './app/Server';
import { WinstonLogger } from './infrastructure/logging/Winston.logger';
import { showBanner } from './common/constants/banner.constants';

const logger = new WinstonLogger();

// === GLOBAL ERROR HANDLING ===
process.on('unhandledRejection', (reason, promise) => {
  const error = new Error(`Unhandled Rejection at: ${promise}`);
  logger.error('Unhandled Rejection', error, { reason });
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception', error);
  process.exit(1);
});

// === BOOTSTRAP ===
(async () => {
  try {
    const server = new Server();
    await server.start();
    showBanner();
    
    

  } catch (error) {
    const logError = error instanceof Error ? error : new Error(String(error));
    logger.error('Failed to start server', logError);
    console.error('Failed to start server:', error);
    process.exit(1);
  }
})();