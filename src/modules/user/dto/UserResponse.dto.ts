// ============================================================
// FILE: src/modules/user/dto/UserResponse.dto.ts
// ============================================================

export class UserResponseDTO {
    private constructor(
        public readonly id: string,
        public readonly firstName: string | null,
        public  readonly middleName: string | null,
        public readonly lastName: string,
        public readonly email: string,
        public readonly phoneNumber: string,
        public readonly street: string,
        public readonly city: string,
        public readonly state: string | null,
        public readonly postalCode: string | null,
        public readonly country: string,
        public readonly isActive: boolean,
        public readonly createdAt: Date,
        public readonly updatedAt: Date,
        public readonly deletedAt: Date | null
    ) {}

    public static create(params: {
        id: string;
        firstName: string | null;
        middleName: string | null;
        lastName: string;
        email: string;
        phoneNumber: string;
        street: string;
        city: string;
        state: string | null;
        postalCode: string | null;
        country: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }): UserResponseDTO {
        return new UserResponseDTO (
            params.id,
            params.firstName,
            params.middleName,
            params.lastName,
            params.email,
            params.phoneNumber,
            params.street,
            params.city,
            params.state,
            params.postalCode,
            params.country,
            params.isActive,
            params.createdAt,
            params.updatedAt,
            params.deletedAt
        )
    }
}