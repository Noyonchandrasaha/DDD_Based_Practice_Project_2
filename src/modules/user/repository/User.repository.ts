// ============================================================
// FILE: src/modules/user/repository/User.repository.ts
// ============================================================

import { BaseRepository } from '@core/abstracts/BaseRepository';
import { User, UserProps } from '../domain/User.entity';
import { Prisma, PrismaClient } from '../../../../generated/prisma';
import { UserNameVO } from '../domain/value-objects/UserName.vo';
import { UserEmailVO } from '../domain/value-objects/UserEmail.vo';
import { PhoneNumberVO } from '../domain/value-objects/PhoneNumber.vo';
import { AddressVO } from '../domain/value-objects/Address.vo';
import { QueryParams } from '@core/types/QueryParams.type';
import { PaginatedResult } from '@core/types/Pagination.type';

type UserRecord = Prisma.UserGetPayload<{}>;

export class UserRepository extends BaseRepository<User> {
  constructor(private readonly prisma: PrismaClient) {
    super();
  }

  protected get dataSource(): Prisma.UserDelegate<any> {
    return this.prisma.user;
  }

  // ==================== Mapping ====================

  protected toDomain(record: UserRecord): User {
    try {
      // Robust name parsing
      const full = (record.name ?? '').trim();
      let firstName: string | undefined;
      let middleName: string | undefined;
      let lastName = '';

      if (full) {
        const parts = full.split(/\s+/);
        if (parts.length === 1) {
          firstName = parts[0];
        } else if (parts.length === 2) {
          [firstName, lastName] = parts;
        } else {
          firstName = parts.shift();
          lastName = parts.pop() || '';
          middleName = parts.join(' ') || undefined;
        }
      }

      const address = (record.address ?? {}) as any;

      const props: UserProps & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt?: Date | null;
      } = {
        id: record.id,
        name: UserNameVO.create(lastName, firstName, middleName), // (last, first, middle) per your VO signature
        email: UserEmailVO.create(record.email),
        phoneNumber: PhoneNumberVO.create(record.phoneNumber),
        address: AddressVO.create(
          address?.street || '',
          address?.city || '',
          address?.country || '',
          address?.state || undefined,
          address?.postalCode || undefined
        ),
        isActive: record.isActive,
        createdAt: record.createdAt,
        updatedAt: record.updatedAt,
        deletedAt: record.deletedAt ?? null
      };

      return User.reconstitute(props);
    } catch (error) {
      throw new Error(`Failed to convert database record to User domain: ${String(error)}`);
    }
  }

  protected toPrismaFilter(filter: Partial<User>) {
    const where: any = {};
    if (filter.email) where.email = filter.email.email;
    if (filter.phoneNumber) where.phoneNumber = filter.phoneNumber.phoneNumber;
    if (filter.isActive !== undefined) where.isActive = filter.isActive;
    // add more field mappings as needed
    return where;
  }

  protected toPrismaCreate(data: Partial<User>) {
    const createData: any = {};
    if (data.name) createData.name = data.name.fullName();
    if (data.email) createData.email = data.email.email;
    if (data.phoneNumber) createData.phoneNumber = data.phoneNumber.phoneNumber;
    if (data.address) {
      createData.address = {
        street: data.address.street,
        city: data.address.city,
        state: data.address.state,
        postalCode: data.address.postalCode,
        country: data.address.country
      };
    }
    if (data.isActive !== undefined) createData.isActive = data.isActive;
    return createData;
  }

  protected toPrismaUpdate(data: Partial<User>) {
    const updateData: any = {};
    if (data.name) updateData.name = data.name.fullName();
    if (data.email) updateData.email = data.email.email;
    if (data.phoneNumber) updateData.phoneNumber = data.phoneNumber.phoneNumber;
    if (data.address) {
      updateData.address = {
        street: data.address.street,
        city: data.address.city,
        state: data.address.state,
        postalCode: data.address.postalCode,
        country: data.address.country
      };
    }
    if (data.isActive !== undefined) updateData.isActive = data.isActive;
    return updateData;
  }

  // ==================== Query Behavior Overrides ====================

  /**
   * Exclude soft-deleted rows by default.
   * Keep this sync to match BaseRepository expectations.
   */
  protected buildWhereClause(params?: QueryParams<Partial<User>>): any {
    const where: any = { deletedAt: null };

    if (params?.filters) {
      Object.assign(where, this.toPrismaFilter(params.filters as any));
    }

    if (params?.search) {
      const or = this.buildSearchClause(params.search);
      if (or.length) where.OR = or;
    }

    if (params?.filters && typeof params.filters === 'object') {
      Object.assign(where, this.buildAdvancedFilters(params.filters as any));
    }

    return where;
  }

  /**
   * Real search across common user fields.
   */
  protected buildSearchClause(search: string): any[] {
    const q = (search ?? '').trim();
    if (!q) return [];
    return [
      { name: { contains: q, mode: 'insensitive' } },
      { email: { contains: q, mode: 'insensitive' } },
      { phoneNumber: { contains: q, mode: 'insensitive' } }
    ];
  }

  /**
   * Tighten advanced filters: keep exact matches on key fields,
   * use "contains" only for non-unique strings.
   */
  protected buildAdvancedFilters(filters: Record<string, any>): any {
    const where: any = {};
    const exactFields = new Set(['id', 'email', 'phoneNumber', 'isActive', 'deletedAt']);

    for (const [field, value] of Object.entries(filters)) {
      if (value === undefined || value === null) continue;

      if (exactFields.has(field)) {
        where[field] = value;
        continue;
      }

      where[field] = typeof value === 'string'
        ? { contains: value, mode: 'insensitive' }
        : value;
    }
    return where;
  }

  // ==================== Convenience Finders ====================

  async findByEmail(email: string): Promise<User | null> {
    const record = await this.dataSource.findUnique({ where: { email } });
    return record ? this.toDomain(record) : null;
  }

  async findByPhone(phoneNumber: string): Promise<User | null> {
    const record = await this.dataSource.findFirst({ where: { phoneNumber } });
    return record ? this.toDomain(record) : null;
  }

  async findActiveUsers(params?: QueryParams<Partial<User>>): Promise<User[]> {
    const activeParams: QueryParams<Partial<User>> = {
      ...params,
      filters: { ...(params?.filters ?? {}), isActive: true }
    };
    return this.findAll(activeParams);
  }

  async findPaginatedActiveUsers(params?: QueryParams<Partial<User>>): Promise<PaginatedResult<User>> {
    const activeParams: QueryParams<Partial<User>> = {
      ...params,
      filters: { ...(params?.filters ?? {}), isActive: true }
    };
    return this.findPaginated(activeParams);
  }

  // ==================== State Mutations (with guards) ====================

  /**
   * For state mutations, we pre-check existence and soft-delete state
   * to avoid acting on deleted rows and to produce friendly errors.
   */
  private async ensureActiveRow(id: string): Promise<UserRecord> {
    const existing = await this.dataSource.findUnique({ where: { id } });
    if (!existing) {
      throw new Error('User not found');
    }
    if (existing.deletedAt) {
      throw new Error('User is soft-deleted');
    }
    return existing as UserRecord;
  }

  async deactivateUser(id: string): Promise<User> {
    await this.ensureActiveRow(id);
    try {
      const record = await this.dataSource.update({
        where: { id },
        data: { isActive: false }
      });
      return this.toDomain(record);
    } catch (e: any) {
      this.handleWriteError(e, 'update');
    }
  }

  async activateUser(id: string): Promise<User> {
    await this.ensureActiveRow(id);
    try {
      const record = await this.dataSource.update({
        where: { id },
        data: { isActive: true }
      });
      return this.toDomain(record);
    } catch (e: any) {
      this.handleWriteError(e, 'update');
    }
  }

  async softDelete(id: string): Promise<User> {
    // allow soft-delete even if currently inactive; just ensure it exists
    const existing = await this.dataSource.findUnique({ where: { id } });
    if (!existing) throw new Error('User not found');

    try {
      const record = await this.dataSource.update({
        where: { id },
        data: { deletedAt: new Date() }
      });
      return this.toDomain(record);
    } catch (e: any) {
      this.handleWriteError(e, 'update');
    }
  }

  async restore(id: string): Promise<User> {
    // can only restore if exists and currently soft-deleted
    const existing = await this.dataSource.findUnique({ where: { id } });
    if (!existing) throw new Error('User not found');
    if (!existing.deletedAt) throw new Error('User is not soft-deleted');

    try {
      const record = await this.dataSource.update({
        where: { id },
        data: { deletedAt: null }
      });
      return this.toDomain(record);
    } catch (e: any) {
      this.handleWriteError(e, 'update');
    }
  }

  // ==================== Inherited Methods (left as-is) ====================

  async findAll(params?: QueryParams<Partial<User>>): Promise<User[]> {
    return super.findAll(params);
  }

  async findPaginated(params?: QueryParams<Partial<User>>): Promise<PaginatedResult<User>> {
    return super.findPaginated(params);
  }

  async count(filter?: Partial<User>): Promise<number> {
    return super.count(filter);
  }
}
