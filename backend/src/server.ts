import app from './app';
import { config } from './config';
import { logger } from './utils/logger';
import { PrismaClient } from '@prisma/client';

// Initialize Prisma client
export const prisma = new PrismaClient();

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('UNCAUGHT EXCEPTION:', err.name, err.message);
  logger.error('Stack:', err.stack);
  process.exit(1);
});

// Start server
const server = app.listen(config.port, () => {
  logger.info(`Server running in ${config.env} mode on port ${config.port}`);
  logger.info(`API accessible at http://localhost:${config.port}${config.apiPrefix}`);
});

// Connect to database
prisma.$connect()
  .then(() => {
    logger.info('Connected to database');
  })
  .catch((err) => {
    logger.error('Failed to connect to database:', err);
    process.exit(1);
  });

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  logger.error('UNHANDLED REJECTION:', err.name, err.message);
  logger.error('Stack:', err.stack);
  
  // Close server & exit process
  server.close(() => {
    process.exit(1);
  });
});

// Handle SIGTERM
process.on('SIGTERM', () => {
  logger.info('SIGTERM RECEIVED. Shutting down gracefully');
  
  server.close(async () => {
    await prisma.$disconnect();
    logger.info('Process terminated!');
    process.exit(0);
  });
});