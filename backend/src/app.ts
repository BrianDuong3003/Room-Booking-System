import express, { Application, Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import compression from 'compression';
import { config } from './config';
import { logger } from './utils/logger';
import { errorMiddleware } from './middlewares/error.middleware';
import routes from './routes';

// Create Express application
const app: Application = express();

// Set security HTTP headers
app.use(helmet());

// Enable CORS
app.use(cors());

// Parse JSON request body
app.use(express.json());

// Parse URL-encoded request body
app.use(express.urlencoded({ extended: true }));

// Compress HTTP responses
app.use(compression());

// Use request/response logging in development
if (config.env !== 'production') {
  app.use(morgan('dev'));
}

// API routes
app.use(config.apiPrefix, routes);

// Root route for health checks
app.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    message: 'ROMS API is running',
    version: config.version,
  });
});

// // 404 route
// app.all('*', (req: Request, res: Response) => {
//   logger.warn(`Route not found: ${req.method} ${req.originalUrl}`);
  
//   res.status(404).json({
//     status: 'error',
//     message: `Cannot find ${req.method} ${req.originalUrl} on this server`,
//   });
// });

// Error handling middleware
app.use(errorMiddleware);

export default app;