// ============================================================
// FILE: src/modules/user/mappers/User.mapper.ts
// ============================================================

import { User, UserProps } from '../domain/User.entity';
import { UserNameVO } from '../domain/value-objects/UserName.vo';
import { UserEmailVO } from '../domain/value-objects/UserEmail.vo';
import { PhoneNumberVO } from '../domain/value-objects/PhoneNumber.vo';
import { AddressVO } from '../domain/value-objects/Address.vo';
import { CreateuserDTO } from '../dto/CreateUser.dto';
import { UpdateUserDTO } from '../dto/UpdateUser.dto';
import { UserResponseDTO } from '../dto/UserResponse.dto';
import { PaginatedUserResponseDTO } from '../dto/PaginatedUserResponse.dto';
import { PaginatedResult } from '@core/types/Pagination.type';

export class UserMapper {
    private static toUndef(v: string | null | undefined): string | undefined {
        const s = typeof v === 'string' ? v.trim() : v;
        return s === null || s === undefined || s === '' ? undefined : s;
    }

    // DTO → Domain props (for create)
    public static toDomainprops(dto: CreateuserDTO): UserProps {
        return {
            name: UserNameVO.create(
                dto.lastName,
                dto.firstName ?? undefined,
                dto.middleName ?? undefined
            ),
            email: UserEmailVO.create(dto.email),
            phoneNumber: PhoneNumberVO.create(dto.phoneNumber),
            address: AddressVO.create(
                dto.street,
                dto.city,
                dto.country,
                dto.state ?? undefined,
                dto.postalCode ?? undefined
            ),
            isActive: true,
        }
    }

    // DTO → Partial domain props (for update)
    public static toUpdateProps(dto: UpdateUserDTO, current: User): Partial<UserProps> {
        const props: Partial<UserProps> = {};

        // ---- Name: update if any provided; merge with current ----
        const hasAnyName =
            dto.firstName !== undefined ||
            dto.middleName !== undefined ||
            dto.lastName !== undefined;

        if (hasAnyName) {
            const lastName   = this.toUndef(dto.lastName)   ?? current.name.value.lastName;
            const firstName  = this.toUndef(dto.firstName)  ?? current.name.value.firstName;
            const middleName = this.toUndef(dto.middleName) ?? current.name.value.middleName;
            if (!lastName) throw new Error('lastName is required'); // invariant
            props.name = UserNameVO.create(lastName, firstName, middleName);
        }

        // ---- Email ----
        if (dto.email !== undefined) {
            const email = this.toUndef(dto.email);
            if (!email) throw new Error('email cannot be empty');
            props.email = UserEmailVO.create(email);
        }

        // ---- Phone ----
        if (dto.phoneNumber !== undefined) {
            const phone = this.toUndef(dto.phoneNumber);
            if (!phone) throw new Error('phoneNumber cannot be empty');
            props.phoneNumber = PhoneNumberVO.create(phone);
        }

        // ---- Address: update if any provided; merge with current ----
        const hasAnyAddress =
            dto.street !== undefined ||
            dto.city !== undefined ||
            dto.state !== undefined ||
            dto.postalCode !== undefined ||
            dto.country !== undefined;

        if (hasAnyAddress) {
            const street     = this.toUndef(dto.street)     ?? current.address.value.street;
            const city       = this.toUndef(dto.city)       ?? current.address.value.city;
            const country    = this.toUndef(dto.country)    ?? current.address.value.country;
            const state      = this.toUndef(dto.state)      ?? current.address.value.state;
            const postalCode = this.toUndef(dto.postalCode) ?? current.address.value.postalCode;

            if (!street || !city || !country) {
            throw new Error('street, city, and country are required');
            }
            props.address = AddressVO.create(street, city, country, state, postalCode);
        }

        if (dto.isActive !== undefined) props.isActive = dto.isActive;

        return props;
    }

    // Domain → Response DTO
    public static toResponseDTO(user: User): UserResponseDTO {
        return UserResponseDTO.create({
            id: user.id,
            firstName: user.name.value.firstName ?? null, // Accessing via the getter `value`
            middleName: user.name.value.middleName ?? null, // Accessing via the getter `value`
            lastName: user.name.value.lastName, // Accessing via the getter `value`
            email: user.email.value.email, // Accessing via the getter `value`
            phoneNumber: user.phoneNumber.value.phoneNumber, // Accessing via the getter `value`
            street: user.address.value.street, // Accessing via the getter `value`
            city: user.address.value.city, // Accessing via the getter `value`
            state: user.address.value.state ?? null, // Accessing via the getter `value`
            postalCode: user.address.value.postalCode ?? null, // Accessing via the getter `value`
            country: user.address.value.country, // Accessing via the getter `value`
            isActive: user.isActive,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            deletedAt: user.deletedAt ?? null
        })
    }

    public static toPaginatedResponseDTO (
        result: PaginatedResult<User>
    ): PaginatedUserResponseDTO{
        return {
            data: result.data.map((user) => {
                return UserMapper.toResponseDTO(user)
            }),
            meta: {
                totalItems: result.meta.totalItems,
                totalPages: result.meta.totalPages,
                currentPage: result.meta.currentPage,
                pageSize: result.meta.pageSize
            }
        }
    }
}
