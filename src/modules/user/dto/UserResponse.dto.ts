// ============================================================
// FILE: src/modules/user/dto/UserResponse.dto.ts
// ============================================================

export class UserResponseDTO {
    private constructor(
        public readonly id: string,
        public readonly firstName: string | null,
        public readonly middleName: string | null,
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
        public readonly deleteAt: Date | null
    ) {}

    public static create(
        id: string,
        firstName: string | null,
        middleName: string | null,
        lastName: string,
        email: string,
        phoneNumber: string,
        street: string,
        city: string,
        state: string | null,
        postalCode: string | null,
        country: string,
        isActive: boolean,
        createdAt: Date,
        updatedAt: Date,
        deleteAt: Date | null
    ): UserResponseDTO{
        return new UserResponseDTO(
            id,
            firstName,
            middleName,
            lastName,
            email,
            phoneNumber,
            street,
            city,
            state,
            postalCode,
            country,
            isActive,
            createdAt,
            updatedAt,
            deleteAt
        )
    }
}