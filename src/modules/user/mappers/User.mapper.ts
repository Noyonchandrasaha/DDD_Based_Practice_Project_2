// ============================================================
// FILE: src/modules/user/mappers/User.mapper.ts
// ============================================================

import { User, UserProps } from '../domain/User.entity';
import { UserNameVO } from '../domain/value-objects/UserName.vo';
import { UserEmailVO } from '../domain/value-objects/UserEmail.vo';
import { PhoneNumberVO } from '../domain/value-objects/PhoneNumber.vo';
import { AddressVO } from '../domain/value-objects/Address.vo';
import { CreateUserDTO } from '../dto/CreateUser.dto';
import { UpdateUserDTO } from '../dto/UpdateUser.dto';
import { UserResponseDTO } from '../dto/UserResponse.dto';
import { PaginatedUserResponseDTO } from '../dto/PaginatedUserResponse.dto';
import { PaginatedResult } from '../../../core/types/Pagination.type';

export class UserMapper {
  private static toUndefined = <T>(v: T | null | undefined): T | undefined =>
    v === null ? undefined : v;

  // ──────────────────────────────────────────────────────────────
  // DTO → Entity (create)
  // ──────────────────────────────────────────────────────────────
  public static toDomainProps(dto: CreateUserDTO): UserProps {
    console.log('Received DTO for mapping:', dto);  // Log the received DTO for mapping
    console.log('Country before mapping to domain:', dto.country);  // Log country before mapping

    return {
      name: UserNameVO.create(
        dto.lastName,                    // ✅ Required
        dto.firstName ?? undefined,      // ✅ Optional
        dto.middleName ?? undefined      // ✅ Optional
      ),
      email: UserEmailVO.create(dto.email),
      phoneNumber: PhoneNumberVO.create(dto.phoneNumber),
      address: AddressVO.create(
        dto.street,
        dto.city,
        dto.country, // Pass country as it is
        dto.state ?? undefined,          // ✅ Optional
        dto.postalCode ?? undefined      // ✅ Optional
      ),
      isActive: true,
    };
  }

  // ──────────────────────────────────────────────────────────────
  // DTO → Partial<Entity> (update)
  // ──────────────────────────────────────────────────────────────
  public static toUpdateProps(dto: UpdateUserDTO): Partial<UserProps> {
    const props: Partial<UserProps> = {};

    // NAME: Only if lastName is provided
    if (dto.lastName !== undefined) {
      props.name = UserNameVO.create(
        dto.lastName,
        this.toUndefined(dto.firstName),
        this.toUndefined(dto.middleName)
      );
    }

    // EMAIL
    if (dto.email !== undefined) {
      props.email = UserEmailVO.create(dto.email);
    }

    // PHONE
    if (dto.phoneNumber !== undefined) {
      props.phoneNumber = PhoneNumberVO.create(dto.phoneNumber);
    }

    // ADDRESS: Only if ALL required fields are provided
    if (
      dto.street !== undefined &&
      dto.city !== undefined &&
      dto.country !== undefined
    ) {
      props.address = AddressVO.create(
        dto.street,
        dto.city,
        dto.country,
        this.toUndefined(dto.state),
        this.toUndefined(dto.postalCode)
      );
    }

    // IS ACTIVE
    if (dto.isActive !== undefined) {
      props.isActive = dto.isActive;
    }

    return props;
  }

  // ──────────────────────────────────────────────────────────────
  // Entity → DTO
  // ──────────────────────────────────────────────────────────────
  public static toResponseDTO(user: User): UserResponseDTO {
    return {
      id: user.id,
      firstName: user.name.firstName ?? null,
      middleName: user.name.middleName ?? null,
      lastName: user.name.lastName,
      email: user.email.email,
      phoneNumber: user.phoneNumber.phoneNumber,
      street: user.address.street,
      city: user.address.city,
      state: user.address.state ?? null,
      postalCode: user.address.postalCode ?? null,
      country: user.address.country,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      deleteAt: (user as any).deletedAt ?? null as Date | null
    };
  }

  // ──────────────────────────────────────────────────────────────
  // Paginated → DTO
  // ──────────────────────────────────────────────────────────────
  public static toPaginatedResponseDTO(
    result: PaginatedResult<User>
  ): PaginatedUserResponseDTO {
    return {
      data: result.data.map(UserMapper.toResponseDTO),
      meta: {
        totalItems: result.meta.totalItems,
        totalPages: result.meta.totalPages,
        currentPage: result.meta.currentPage,
        pageSize: result.meta.pageSize,
      },
    };
  }
}



// // src/modules/user/mappers/User.mapper.ts
// import { User, UserProps } from '../domain/User.entity';
// import { UserNameVO } from '../domain/value-objects/UserName.vo';
// import { UserEmailVO } from '../domain/value-objects/UserEmail.vo';
// import { PhoneNumberVO } from '../domain/value-objects/PhoneNumber.vo';
// import { AddressVO } from '../domain/value-objects/Address.vo';
// import { CreateUserDTO } from '../dto/CreateUser.dto';
// import { UpdateUserDTO } from '../dto/UpdateUser.dto';
// import { UserResponseDTO } from '../dto/UserResponse.dto';
// import { PaginatedUserResponseDTO } from '../dto/PaginatedUserResponse.dto';
// import { PaginatedResult } from '../../../core/types/Pagination.type';

// export class UserMapper {
//   private static toUndefined = <T>(v: T | null | undefined): T | undefined =>
//     v === null ? undefined : v;

//   // ──────────────────────────────────────────────────────────────
//   // DTO → Entity (create)
//   // ──────────────────────────────────────────────────────────────
//   public static toDomainProps(dto: CreateUserDTO): UserProps {
//     console.log('Recived DTO:', dto);
//      console.log('Country before mapping to domain:', dto.country);
//     return {
//       name: UserNameVO.create(
//         dto.lastName,                    // ✅ Required
//         dto.firstName ?? undefined,      // ✅ Optional
//         dto.middleName ?? undefined      // ✅ Optional
//       ),
//       email: UserEmailVO.create(dto.email),
//       phoneNumber: PhoneNumberVO.create(dto.phoneNumber),
//       address: AddressVO.create(
//         dto.street,
//         dto.city,
//         dto.country,
//         dto.state ?? undefined,          // ✅ Optional
//         dto.postalCode ?? undefined      // ✅ Optional
//       ),
//       isActive: true,
//     };
//   }

//   // ──────────────────────────────────────────────────────────────
//   // DTO → Partial<Entity> (update)
//   // ──────────────────────────────────────────────────────────────
//   public static toUpdateProps(dto: UpdateUserDTO): Partial<UserProps> {
//     const props: Partial<UserProps> = {};

//     // NAME: Only if lastName is provided
//     if (dto.lastName !== undefined) {
//       props.name = UserNameVO.create(
//         dto.lastName,
//         this.toUndefined(dto.firstName),
//         this.toUndefined(dto.middleName)
//       );
//     }

//     // EMAIL
//     if (dto.email !== undefined) {
//       props.email = UserEmailVO.create(dto.email);
//     }

//     // PHONE
//     if (dto.phoneNumber !== undefined) {
//       props.phoneNumber = PhoneNumberVO.create(dto.phoneNumber);
//     }

//     // ADDRESS: Only if ALL required fields are provided
//     if (
//       dto.street !== undefined &&
//       dto.city !== undefined &&
//       dto.country !== undefined
//     ) {
//       props.address = AddressVO.create(
//         dto.street,
//         dto.city,
//         dto.country,
//         this.toUndefined(dto.state),
//         this.toUndefined(dto.postalCode)
//       );
//     }

//     // IS ACTIVE
//     if (dto.isActive !== undefined) {
//       props.isActive = dto.isActive;
//     }

    

//     return props;
//   }

//   // ──────────────────────────────────────────────────────────────
//   // Entity → DTO
//   // ──────────────────────────────────────────────────────────────
//   public static toResponseDTO(user: User): UserResponseDTO {
//     return {
//       id: user.id,
//       firstName: user.name.firstName ?? null,
//       middleName: user.name.middleName ?? null,
//       lastName: user.name.lastName,
//       email: user.email.email,
//       phoneNumber: user.phoneNumber.phoneNumber,
//       street: user.address.street,
//       city: user.address.city,
//       state: user.address.state ?? null,
//       postalCode: user.address.postalCode ?? null,
//       country: user.address.country,
//       isActive: user.isActive,
//       createdAt: user.createdAt,
//       updatedAt: user.updatedAt,
//       deleteAt: (user as any).deletedAt ?? null as Date | null
//     };
//   }

//   // ──────────────────────────────────────────────────────────────
//   // Paginated → DTO
//   // ──────────────────────────────────────────────────────────────
//   public static toPaginatedResponseDTO(
//     result: PaginatedResult<User>
//   ): PaginatedUserResponseDTO {
//     return {
//       data: result.data.map(UserMapper.toResponseDTO),
//       meta: {
//         totalItems: result.meta.totalItems,
//         totalPages: result.meta.totalPages,
//         currentPage: result.meta.currentPage,
//         pageSize: result.meta.pageSize,
//       },
//     };
//   }
// }