// ============================================================================
// FILE: src/common/pipes/SanitationPipe.ts
// ============================================================================

import { Request, Response, NextFunction } from 'express';
import xss from 'xss';

export interface SanitationOptions {
  target?: 'body' | 'query' | 'params';
  trimStrings?: boolean;
  sanitizeHTML?: boolean;
}

export const SanitationPipe = (options: SanitationOptions = {}) => {
  const { target = 'body', trimStrings = true, sanitizeHTML = true } = options;

  const sanitizeValue = (value: unknown): unknown => {
    if (typeof value === 'string') {
      let sanitized = value;
      if (trimStrings) sanitized = sanitized.trim();
      if (sanitizeHTML) sanitized = xss(sanitized, {
        whiteList: {}, 
        stripIgnoreTag: true,
        stripIgnoreTagBody: ['script'],
      });
      return sanitized;
    }

    if (Array.isArray(value)) {
      return value.map(sanitizeValue);
    }

    if (value && typeof value === 'object') {
      const obj = value as Record<string, unknown>;
      const sanitized: Record<string, unknown> = {};
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          sanitized[key] = sanitizeValue(obj[key]);
        }
      }
      return sanitized;
    }

    return value;
  };

  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      const data = req[target];
      if (data && typeof data === 'object') {
        req[target] = sanitizeValue(data) as any;
      }
      next();
    } catch (err: unknown) {
      next(err);
    }
  };
};