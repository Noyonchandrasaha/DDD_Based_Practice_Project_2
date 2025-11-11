// ============================================================
// FILE: src/modules/user/controller/User.controller.ts
// ============================================================

import { Request, Response } from 'express';

import { UserService } from '../service/User.service';
import { UserMapper } from '../mappers/User.mapper';

import { CreateUserSchema } from '../validator/CreateUser.validator';
import { UpdateUserSchema } from '../validator/UpdateUser.validator';
import { CreateuserDTO } from '../dto/CreateUser.dto';

import { QueryParams } from '@core/types/QueryParams.type';
import { User } from '../domain/User.entity';
import { ResponseHandler } from '@common/utils/ResponseHandler.util';
import { HttpStatus } from '@core/enums/HttpStatus.enum';


export class UserController {
  constructor(private readonly service: UserService) {}

  // GET /api/users
  list = async (req: Request, res: Response) => {
    try {
      const params = this.parseQueryParams(req);
      const result = await this.service.list(params);

      // If result contains pagination (data + meta), handle appropriately
      if (result?.data) {
        const paginatedResponse = UserMapper.toPaginatedResponseDTO(result);
        ResponseHandler.success(res, paginatedResponse, "Fetch users successfully", HttpStatus.OK);
      } else {
        // If result doesn't contain pagination, just pass the raw data
        ResponseHandler.success(res, result, "Fetch users successfully", HttpStatus.OK);
      }
    } catch (err) {
      ResponseHandler.error(res, err);
    }
  };

  // GET /api/users/:id
  getById = async (req: Request, res: Response) => {
    try {
      const includeDeleted = req.query.includeDeleted === 'true';
      const entity = await this.service.getById(req.params.id, includeDeleted);
      const dto = UserMapper.toResponseDTO(entity);
      ResponseHandler.success(res, dto, "Fetch user sucessfully.", HttpStatus.OK);
    } catch (err) {
      ResponseHandler.error(res, err)
    }
  };

  // POST /api/users
  create = async (req: Request, res: Response) => {
    try {
      // validate body
      const validated = CreateUserSchema.parse(req.body);
      // build DTO expected by service (since your service takes CreateuserDTO)
      const dto = CreateuserDTO.fromValidatedData({
        firstName:  validated.firstName  ?? undefined,
        middleName: validated.middleName ?? undefined,
        lastName:   validated.lastName,
        email:      validated.email,
        phoneNumber:validated.phoneNumber,
        street:     validated.street,
        city:       validated.city,
        state:      validated.state      ?? undefined,
        postalCode: validated.postalCode ?? undefined,
        country:    validated.country
      });

      const entity = await this.service.create(dto);
      const resp = UserMapper.toResponseDTO(entity);
      ResponseHandler.success(res, resp, "User created Successfully.", HttpStatus.CREATED)
    } catch (err) {
      ResponseHandler.error(res, err)
    }
  };

  // PATCH /api/users/:id
  update = async (req: Request, res: Response) => {
    try {
      const validated = UpdateUserSchema.parse(req.body);
      const entity = await this.service.update(req.params.id, validated);
      const dto = UserMapper.toResponseDTO(entity);
      ResponseHandler.success(res, dto, "User updated sucessfully", HttpStatus.OK)
    } catch (err) {
      ResponseHandler.error(res, err)
    }
  };

  // DELETE /api/users/:id  -> 204 No Content
  softDelete = async (req: Request, res: Response) => {
    try {
      await this.service.softDelete(req.params.id, 'admin'); // actor optional
      ResponseHandler.success(res,null, "User deleted sucessfully", HttpStatus.NO_CONTENT )
    } catch (err) {
      ResponseHandler.error(res,err)
    }
  };

  // POST /api/users/:id/restore
  restore = async (req: Request, res: Response) => {
    try {
      const entity = await this.service.restore(req.params.id);
      const dto = UserMapper.toResponseDTO(entity);
      ResponseHandler.success(res, dto, "User scussfully restored.", HttpStatus.OK);
    } catch (err) {
      ResponseHandler.error(res, err)
    }
  };

  // POST /api/users/:id/activate
  activate = async (req: Request, res: Response) => {
    try {
      const entity = await this.service.activate(req.params.id);
      const dto = UserMapper.toResponseDTO(entity);
      ResponseHandler.success(res, dto, "User scussfully activated.", HttpStatus.OK)
    } catch (err) {
     ResponseHandler.error(res, err)
    }
  };

  // POST /api/users/:id/deactivate
  deactivate = async (req: Request, res: Response) => {
    try {
      const entity = await this.service.deactivate(req.params.id);
      const dto = UserMapper.toResponseDTO(entity);
      ResponseHandler.success(res, dto, "User scussfully deactivated.", HttpStatus.OK);
    } catch (err) {
      ResponseHandler.error(res, err)
    }
  };

  // -------- helpers --------
  private parseQueryParams(req: Request): QueryParams<Partial<User>> {
    const q = req.query as any;

    const page = q.page ? Number(q.page) : undefined;
    const limit = q.limit ? Number(q.limit) : undefined;
    const sortBy = q.sortBy ? String(q.sortBy) : undefined;
    const sortOrder =
      q.sortOrder === 'desc' ? 'desc' :
      q.sortOrder === 'asc'  ? 'asc'  : undefined;

    const search = q.search ? String(q.search).trim() : undefined;

    // If you send filters like filters[isActive]=true, Express will parse into an object
    const filters = q.filters && typeof q.filters === 'object' ? q.filters : undefined;

    return { page, limit, sortBy, sortOrder, search, filters };
  }
}
