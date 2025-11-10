// ============================================================
// FILE: src/modules/user/dto/UpdateUser.dto.ts
// ============================================================

import { UpdateUserInput } from '../validator/UpdateUser.validator';

export class UpdateUserDTO{
    private constructor(
        public readonly firstName?: string | null,
        public readonly middleName?: string | null,
        public readonly lastName?: string | null,
        public readonly email?: string | null,
        public readonly phoneNumber ?: string | null,
        public readonly street ?: string | null,
        public readonly city ?: string | null,
        public readonly state ?: string | null,
        public readonly postalCode ?: string | null,
        public readonly country ?: string | null,
        public readonly isActive ?: boolean
    ) {}

    public static fromValidatedDate (data: UpdateUserInput): UpdateUserDTO{
        return new UpdateUserDTO(
            data.firstName,
            data.middleName,
            data.lastName,
            data.email,
            data.phoneNumber,
            data.street,
            data.city,
            data.state,
            data.postalCode,
            data.country,
            data.isActive
        )
    }
}