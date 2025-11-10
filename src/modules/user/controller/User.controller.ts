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

// ---- simple error mapper for HTTP status codes ----
function mapErrorToHttp(err: unknown): { status: number; body: any } {
  const msg = (err instanceof Error ? err.message : String(err)).toLowerCase();

  if (msg.includes('not found'))                 return { status: 404, body: { message: 'User not found' } };
  if (msg.includes('soft-deleted'))              return { status: 409, body: { message: 'User is soft-deleted' } };
  if (msg.includes('not soft-deleted'))          return { status: 409, body: { message: 'User is not soft-deleted' } };
  if (msg.includes('already soft-deleted'))      return { status: 409, body: { message: 'User is already soft-deleted' } };
  if (msg.includes('email') && msg.includes('unique')) return { status: 409, body: { message: 'Email already in use' } };

  return { status: 400, body: { message: err instanceof Error ? err.message : 'Bad Request' } };
}

export class UserController {
  constructor(private readonly service: UserService) {}

  // GET /api/users
  list = async (req: Request, res: Response) => {
    try {
      const params = this.parseQueryParams(req);
      const result = await this.service.list(params);
      res.status(200).json(result);
    } catch (err) {
      const { status, body } = mapErrorToHttp(err);
      res.status(status).json(body);
    }
  };

  // GET /api/users/:id
  getById = async (req: Request, res: Response) => {
    try {
      const includeDeleted = req.query.includeDeleted === 'true';
      const entity = await this.service.getById(req.params.id, includeDeleted);
      const dto = UserMapper.toResponseDTO(entity);
      res.status(200).json(dto);
    } catch (err) {
      const { status, body } = mapErrorToHttp(err);
      res.status(status).json(body);
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
      res.status(201).json(resp);
    } catch (err) {
      const { status, body } = mapErrorToHttp(err);
      res.status(status).json(body);
    }
  };

  // PATCH /api/users/:id
  update = async (req: Request, res: Response) => {
    try {
      const validated = UpdateUserSchema.parse(req.body);
      const entity = await this.service.update(req.params.id, validated);
      const dto = UserMapper.toResponseDTO(entity);
      res.status(200).json(dto);
    } catch (err) {
      const { status, body } = mapErrorToHttp(err);
      res.status(status).json(body);
    }
  };

  // DELETE /api/users/:id  -> 204 No Content
  softDelete = async (req: Request, res: Response) => {
    try {
      await this.service.softDelete(req.params.id, 'admin'); // actor optional
      res.status(204).send();
    } catch (err) {
      const { status, body } = mapErrorToHttp(err);
      res.status(status).json(body);
    }
  };

  // POST /api/users/:id/restore
  restore = async (req: Request, res: Response) => {
    try {
      const entity = await this.service.restore(req.params.id);
      const dto = UserMapper.toResponseDTO(entity);
      res.status(200).json(dto);
    } catch (err) {
      const { status, body } = mapErrorToHttp(err);
      res.status(status).json(body);
    }
  };

  // POST /api/users/:id/activate
  activate = async (req: Request, res: Response) => {
    try {
      const entity = await this.service.activate(req.params.id);
      const dto = UserMapper.toResponseDTO(entity);
      res.status(200).json(dto);
    } catch (err) {
      const { status, body } = mapErrorToHttp(err);
      res.status(status).json(body);
    }
  };

  // POST /api/users/:id/deactivate
  deactivate = async (req: Request, res: Response) => {
    try {
      const entity = await this.service.deactivate(req.params.id);
      const dto = UserMapper.toResponseDTO(entity);
      res.status(200).json(dto);
    } catch (err) {
      const { status, body } = mapErrorToHttp(err);
      res.status(status).json(body);
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
