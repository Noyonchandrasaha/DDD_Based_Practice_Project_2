// ============================================================
// FILE: src/modules/user/dto/UpdateUser.dto.ts
// ============================================================

import { UpdateUserSchema } from '../validator/UpdateUser.validator';

export class UpdateUserDTO {
    private constructor(
        public readonly firstName?: string | null,
        public readonly middleName?: string | null,
        public readonly lastName?: string,
        public readonly email?: string,
        public readonly phoneNumber?: string,
        public readonly street ?: string,
        public readonly city?: string,
        public readonly state?: string | null,
        public readonly postalCode?: string | null,
        public readonly country?: string,
        public readonly isActive?: boolean
    ) {}

    public static create (input: unknown): UpdateUserDTO {
        const data = UpdateUserSchema.parse(input);
        return new UpdateUserDTO(
            data.firstName ?? undefined,
            data.middleName ?? undefined,
            data.lastName,
            data.email,
            data.phoneNumber,
            data.street,
            data.city,
            data.state ?? undefined,
            data.postalCode ?? undefined,
            data.country,
            data.isActive
        )
    }
}