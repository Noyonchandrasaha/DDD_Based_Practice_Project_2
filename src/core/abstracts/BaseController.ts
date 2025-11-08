// ============================================================
// FILE: src/core/abstracts/BaseController.ts
// ============================================================

import { Request, Response, NextFunction } from 'express';
import { IService } from '../interfaces/IService';
import { IValidator } from '../interfaces/IValidator';
import { IMiddleware } from '../interfaces/IMiddleware';
import { PaginatedResult } from '../types/Pagination.type';
import { QueryParams } from '../types/QueryParams.type';
import { HttpStatus } from '../enums/HttpStatus.enum';
import { ResponseHandler } from '../../common/utils/ResponseHandler.util';

export abstract class BaseController<T> {
  protected service: IService<T>;
  protected validator?: IValidator;
  protected middlewares?: IMiddleware[];

  constructor(
    service: IService<T>,
    validator?: IValidator,
    middlewares?: IMiddleware[]
  ) {
    this.service = service;
    this.validator = validator;
    this.middlewares = middlewares;
  }

  // GET /:id
  public getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const entity = await this.service.getById(id);
      ResponseHandler.success(
        res,
        entity,
        "Entity fetched successfully",
        HttpStatus.OK
      )
      
    } catch (error) {
      next(error);
    }
  };

  // GET /
  public getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const params = req.query as unknown as QueryParams<Partial<T>>;
      const result: PaginatedResult<T> = await this.service.getAll(params);
      ResponseHandler.success(
        res,
        result,
        "Entities fetched successfully",
        HttpStatus.OK
      )
    } catch (error) {
      next(error);
    }
  };

  // POST /
  public create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Validation should be middleware, not in controller method
    const data = await this.service.create(req.body);
    ResponseHandler.success(
      res,
      data,
      "Entity created successfully",
      HttpStatus.CREATED
    )
  } catch (error) {
    next(error);
  }
};

  // PUT /:id
  public update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      if (this.validator) {
        await this.validator.validate(req.body)(req, res, next);
      }
      const updated = await this.service.update(id, req.body);
      ResponseHandler.success(
        res,
        updated,
        "Entity updated successfully",
        HttpStatus.OK
      )
    } catch (error) {
      next(error);
    }
  };

  // DELETE /:id
  public delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      await this.service.delete(id);
      ResponseHandler.success(
        res,
        null,
        "Entity deleted successfully",
        HttpStatus.NO_CONTENT
      )
    } catch (error) {
      next(error);
    }
  };
}
