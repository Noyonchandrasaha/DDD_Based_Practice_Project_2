// ============================================================================
// FILE: src/common/middlewares/Validator.middleware.ts
// ============================================================================
import { Request, Response, NextFunction } from 'express';
import { BaseMiddleware } from '../../core/abstracts/BaseMiddleware';
import { ValidationException } from '../exceptions/ValidationException';
import { ZodType, ZodError, z } from 'zod';
import { ERROR_MESSAGES } from '../constants/error-messages.constants';

export interface ValidationSchema {
  body?: ZodType<any>;
  query?: ZodType<any>;
  params?: ZodType<any>;
}

export class ValidatorMiddleware extends BaseMiddleware {
  private schema: ValidationSchema;

  constructor(schema: ValidationSchema, logger?: any) {
    super(logger);
    this.schema = schema;
  }

  // Main handler for validation
  public async handle(req: Request, _res: Response, next: NextFunction): Promise<void> {
    const errors: Record<string, string> = {};

    // Function to extract issues from ZodError
    const extractIssues = (err: ZodError) => {
      err.issues.forEach((issue) => {
        const fieldName = issue.path[issue.path.length - 1] as string;
        const message = this.getErrorMessage(issue);
        errors[fieldName] = message;
      });
    };

    // Validate body
    if (this.schema.body) {
      try {
        req.body = this.schema.body instanceof z.ZodObject
          ? this.schema.body.passthrough().parse(req.body)
          : this.schema.body.parse(req.body); // Standard validation
      } catch (err: any) {
        if (err instanceof ZodError) extractIssues(err);
      }
    }

    // Validate query
    if (this.schema.query) {
      try {
        req.query = this.schema.query instanceof z.ZodObject
          ? this.schema.query.passthrough().parse(req.query)
          : this.schema.query.parse(req.query);
      } catch (err: any) {
        if (err instanceof ZodError) extractIssues(err);
      }
    }

    // Validate params
    if (this.schema.params) {
      try {
        req.params = this.schema.params instanceof z.ZodObject
          ? this.schema.params.passthrough().parse(req.params)
          : this.schema.params.parse(req.params);
      } catch (err: any) {
        if (err instanceof ZodError) extractIssues(err);
      }
    }

    // If there are any errors, pass them to the ValidationException
    if (Object.keys(errors).length > 0) {
      this.logger?.warn('Validation failed', { errors });
      next(new ValidationException(ERROR_MESSAGES.VALIDATION_FAILED, errors));
      return;
    }

    next();
  }

  // Function to return user-friendly error messages for each issue
  private getErrorMessage(issue: any): string {
    switch (issue.code) {
      case 'invalid_type':
        return `${issue.path[0]} is invalid, expected ${issue.expected}`;
      case 'too_small':
        return `${issue.path[0]} is too short`;
      case 'too_big':
        return `${issue.path[0]} is too long`;
      case 'custom':
        return issue.message || `${issue.path[0]} is invalid`;
      default:
        return `${issue.path[0]} is invalid`;
    }
  }
}
