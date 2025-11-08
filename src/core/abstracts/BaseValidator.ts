// ============================================================
// FILE: src/core/abstracts/BaseValidator.ts
// ============================================================

import { Request, Response, NextFunction } from 'express';
import { z, ZodType, ZodError } from 'zod';
import { HttpStatus } from '../enums/HttpStatus.enum';
import { IValidator } from '../interfaces/IValidator';
import { StructuredError } from '../../core/types/ApiResponse.type';
import { ResponseHandler } from '../../common/utils/ResponseHandler.util';
import { ERROR_MESSAGES } from '../../common/constants/error-messages.constants';

export abstract class BaseValidator implements IValidator {
    validate(schema: ZodType<any, any>) {
        return async (req: Request, res: Response, next: NextFunction) => {
            try {
                const data = {
                    ...req.body,
                    ...req.query,
                    ...req.params,
                };

                await schema.parseAsync(data);
                return next();
            } catch (err: any) {
                if (err instanceof ZodError) {
                     const tree = z.treeifyError(err);

                    // Flatten the tree recursively
                    const flattenTree = (node: any, path = '', acc: Record<string, string> = {}) => {
                        if (node.errors && Array.isArray(node.errors)) {
                        acc[path || 'unknown'] = node.errors.join(', ');
                        }

                        for (const key in node) {
                        if (key !== 'errors' && node[key]) {
                            flattenTree(node[key], path ? `${path}.${key}` : key, acc);
                        }
                        }

                        return acc;
                    };

                    const flatFields: Record<string, string> = flattenTree(tree);
                    const errorDetails: StructuredError = {
                        code: "VALIDATION_ERROR",
                        fields: flatFields,
                        stack: undefined
                    }
                    return ResponseHandler.error(
                        res,
                        errorDetails,
                        ERROR_MESSAGES.VALIDATION_FAILED,
                        HttpStatus.BAD_REQUEST
                    )
                }
                return next(err);
            }
        };
    }
}