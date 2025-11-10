// ============================================================
// FILE: src/modules/user/dto/CreateUser.dto.ts
// ============================================================
import { CreateUserInput } from '../validator/CreateUser.validator'

export class CreateuserDTO {
    private constructor (
        public readonly firstName: string | undefined,
        public readonly middleName: string | undefined,
        public readonly lastName: string,
        public readonly email: string,
        public readonly phoneNumber: string,
        public readonly street: string,
        public readonly city: string,
        public readonly state: string | undefined,
        public readonly postalCode: string | undefined,
        public readonly country: string
    ) {}

    public static fromValidatedData(data: CreateUserInput): CreateuserDTO {
        return new CreateuserDTO(
            data.firstName,
            data.middleName,
            data.lastName,
            data.email,
            data.phoneNumber,
            data.street,
            data.city,
            data.state,
            data.postalCode,
            data.country
        )
    }
}