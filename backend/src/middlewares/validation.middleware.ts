import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain, ValidationError } from 'express-validator';
import { ApiError } from './error.middleware';

// Middleware that checks validation results from express-validator
export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    // Run all validations
    await Promise.all(validations.map(validation => validation.run(req)));

    // Check for validation errors
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    // Format errors
    const extractedErrors = errors.array().map((err: ValidationError) => {
      if ('path' in err) {
        return { [err.path]: err.msg };
      }
      return { error: err.msg };
    });
    
    // Create ApiError with correct parameter order
    const error = new ApiError(400, 'Validation failed');
    // Add extracted errors as a custom property
    (error as any).errors = extractedErrors;
    
    return next(error);
  };
};