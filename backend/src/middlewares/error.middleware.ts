import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { logger } from '../utils/logger';
import { config } from '../config';

// Custom error class for API errors
export class ApiError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(statusCode: number, message: string, isOperational = true, stack = '') {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

// Error handler middleware
export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  let error = { ...err };
  error.message = err.message;

  // Log the error
  logger.error(
    `${req.method} ${req.path} - ${(err as ApiError).statusCode || 500}: ${err.message}`,
    { 
      stack: err.stack,
      body: req.body,
      params: req.params,
      query: req.query
    }
  );

  // Handle specific error types
  
  // Prisma client known request error
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // Handle unique constraint violations
    if (err.code === 'P2002') {
      const field = err.meta?.target as string[];
      error = new ApiError(
        409,
        `A record with this ${field.join(', ')} already exists.`,
        true,
        err.stack
      );
    }
    // Handle foreign key constraint failures
    else if (err.code === 'P2003') {
      error = new ApiError(
        400,
        'The request references a record that does not exist.',
        true,
        err.stack
      );
    }
    // Handle record not found
    else if (err.code === 'P2025') {
      error = new ApiError(
        404,
        'The requested record was not found.',
        true,
        err.stack
      );
    }
  }
  
  // Prisma client validation error
  if (err instanceof Prisma.PrismaClientValidationError) {
    error = new ApiError(
      400,
      'Invalid input data. Please check your request parameters.',
      true,
      err.stack
    );
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = new ApiError(401, 'Invalid token. Please log in again.', true, err.stack);
  }

  if (err.name === 'TokenExpiredError') {
    error = new ApiError(401, 'Your token has expired. Please log in again.', true, err.stack);
  }

  // Send error response
  const statusCode = (err as ApiError).statusCode || 500;
  
  res.status(statusCode).json({
    status: 'error',
    message: error.message || 'Internal server error',
    stack: config.env === 'development' ? err.stack : undefined,
  });
};