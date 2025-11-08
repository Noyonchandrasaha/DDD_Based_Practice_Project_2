// ============================================================
// FILE: src/modules/user/repository/User.repository.ts
// ============================================================

import { BaseRepository } from '../../../core/abstracts/BaseRepository';
import { User, UserProps } from '../domain/User.entity';
import { PrismaClient, Prisma } from '../../../../generated/prisma';
import { UserNameVO } from '../domain/value-objects/UserName.vo';
import { UserEmailVO } from '../domain/value-objects/UserEmail.vo';
import { PhoneNumberVO } from '../domain/value-objects/PhoneNumber.vo';
import { AddressVO } from '../domain/value-objects/Address.vo';
import { QueryParams } from '@/core/types/QueryParams.type';
import { PaginatedResult } from '@/core/types/Pagination.type';

export class UserRepository extends BaseRepository<User> {
    constructor(private readonly prisma: PrismaClient) {
        super()
    }

    protected get dataSource(): Prisma.UserDelegate<any> {
        return this.prisma.user;
    }

    protected toDomain(record: Prisma.UserGetPayload<{}>): User {
        try {
            const nameParts = record.name.split(" ");
            const lastName = nameParts.pop() || '';
            const firstName = nameParts.shift();
            const middleName = nameParts.join(" ") || undefined;

            // ✅ FIX: Access address as object, not string
            const address = record.address as any; // Cast to access properties
            
            const props: UserProps & { id: string; createdAt: Date; updatedAt: Date } = {
                id: record.id,
                name: UserNameVO.create(lastName, firstName, middleName),
                email: UserEmailVO.create(record.email),
                phoneNumber: PhoneNumberVO.create(record.phoneNumber),
                // ✅ FIX: Use address object properties directly
                address: AddressVO.create(
                    address?.street || '',
                    address?.city || '',
                    address?.country || '',
                    address?.state || undefined,
                    address?.postalCode || undefined
                ),
                isActive: record.isActive,
                createdAt: record.createdAt,
                updatedAt: record.updatedAt
            }

            return User.reconstitute(props);
        } catch (error) {
            throw new Error(`Failed to convert database record to User domain: ${error}`)
        }
    }

    protected toPrismaFilter(filter: Partial<User>) {
        const where: any = {};
        if (filter.email) where.email = filter.email.email;
        if (filter.phoneNumber) where.phoneNumber = filter.phoneNumber.phoneNumber;
        if (filter.isActive !== undefined) where.isActive = filter.isActive;
        return where;
    }

    protected toPrismaCreate(data: Partial<User>) {
        const createData: any = {};
        if (data.name) createData.name = data.name.fullName();
        if (data.email) createData.email = data.email.email;
        if (data.phoneNumber) createData.phoneNumber = data.phoneNumber.phoneNumber;
        
        // ✅ FIX: Create address as object, not string
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
        
        // ✅ FIX: Update address as object, not string
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
        updateData.updatedAt = new Date();

        return updateData;
    }

    protected buildSearchClause(_search: string): any[] {
        return [
            { name: { contains: _search, mode: 'insensitive' } },
            { email: { contains: _search, mode: 'insensitive' } },
            { phoneNumber: { contains: _search, mode: 'insensitive' } },
            // ✅ FIX: Use path syntax for MongoDB embedded documents
            { address: { path: 'street', string: { contains: _search, mode: 'insensitive' } } },
            { address: { path: 'city', string: { contains: _search, mode: 'insensitive' } } },
            { address: { path: 'country', string: { contains: _search, mode: 'insensitive' } } }
        ];
    }

    async findByEmail(email: string): Promise<User | null> {
        const record = await this.dataSource.findUnique({
            where: {
                email
            }
        });
        return record ? this.toDomain(record) : null;
    }

    async findByPhone(phoneNumber: string): Promise<User | null> {
        const record = await this.dataSource.findFirst({
            where: {
                phoneNumber
            }
        })
        return record ? this.toDomain(record) : null
    }

    // async findByCity(city: string): Promise<User[]> {
    //     const records = await this.dataSource.findMany({
    //         where: {
    //             // ✅ FIX: Use MongoDB path syntax for embedded documents
    //             address: {
    //                 path: 'city',
    //                 string: {
    //                     contains: city,
    //                     mode: 'insensitive'
    //                 }
    //             }
    //         }
    //     });
    //     return records.map((record: Prisma.UserGetPayload<{}>) => this.toDomain(record))
    // }

    // async findByCountry(country: string): Promise<User[]> {
    //     const records = await this.dataSource.findMany({
    //         where: {
    //             // ✅ FIX: Use MongoDB path syntax for embedded documents
    //             address: {
    //                 path: 'country',
    //                 string: {
    //                     contains: country,
    //                     mode: 'insensitive'
    //                 }
    //             }
    //         }
    //     });
    //     return records.map((record: Prisma.UserGetPayload<{}>) => this.toDomain(record))
    // }

    // ... rest of your methods remain the same
    async findActiveUsers(params?: QueryParams<Partial<UserProps>>): Promise<User[]> {
        const activeParams: QueryParams<Partial<UserProps>> = {
            ...params,
            filters: { ...params?.filters, isActive: true }
        };
        return this.findAll(activeParams)
    }

    async findPaginatedActiveUsers(params?: QueryParams<Partial<UserProps>>): Promise<any> {
        const activeParams: QueryParams<Partial<UserProps>> = {
            ...params,
            filters: {
                ...params?.filters, isActive: true
            }
        }
        return this.findPaginated(activeParams)
    }

    async deactivateUser(id: string): Promise<User> {
        const record = await this.dataSource.update({
            where: { id },
            data: {
                isActive: false,
                updatedAt: new Date()
            }
        })
        return this.toDomain(record)
    }

    async activateUser(id: string): Promise<User> {
        const record = await this.dataSource.update({
            where: { id },
            data: {
                isActive: true,
                updatedAt: new Date()
            }
        });
        return this.toDomain(record)
    }

    async softDelete(id: string): Promise<User> {
        const record = await this.dataSource.update({
            where: { id },
            data: {
                deletedAt: new Date(),
                updatedAt: new Date()
            }
        });
        return this.toDomain(record)
    }

    async restore(id: string): Promise<User> {
        const record = await this.dataSource.update({
            where: { id },
            data: {
                deletedAt: null,
                updatedAt: new Date()
            }
        });
        return this.toDomain(record)
    }

    protected buildWhereClause(params?: QueryParams<Partial<UserProps>>): any {
        const where: any = {};

        // Add soft delete filter first
        where.deletedAt = null;

        // Basic filters from parent
        if (params?.filters) {
            Object.assign(where, this.toPrismaFilter(params.filters));
        }

        // Search across multiple fields
        if (params?.search) {
            where.OR = this.buildSearchClause(params.search);
        }

        // Advanced filter conditions
        if (params?.filters && typeof params.filters === 'object') {
            Object.assign(where, this.buildAdvancedFilters(params.filters));
        }

        return where;
    }

    async findAll(params?: QueryParams<Partial<User>> | undefined): Promise<User[]> {
        return super.findAll(params)
    }

    async findPaginated(params?: QueryParams<Partial<User>> | undefined): Promise<PaginatedResult<User>> {
        return super.findPaginated(params)
    }

    async count(filter?: Partial<User> | undefined): Promise<number> {
        return super.count(filter);
    }

    async findUsersCreatedAfter(date: Date): Promise<User[]> {
        const records = await this.dataSource.findMany({
            where: {
                createdAt: {
                    gte: date
                }
            }
        })
        return records.map((record: Prisma.UserGetPayload<{}>) => this.toDomain(record))
    }

    async findUsersCreatedBetween(startDate: Date, endDate: Date): Promise<User[]> {
        const records = await this.dataSource.findMany({
            where: {
                createdAt: {
                    gte: startDate,
                    lte: endDate
                }
            }
        })
        return records.map((record: Prisma.UserGetPayload<{}>) => this.toDomain(record))
    }
}