// ============================================================
// FILE: src/modules/user/application/commands/CreateUser.command.ts
// ============================================================

import { CreateUserInput } from '../../validator/CreateUser.validator';

export class CreateUserCommand {
    public readonly firstName?: string | null;
    public readonly middleName?: string | null;
    public readonly lastName: string;
    public readonly email: string;
    public readonly phoneNumber: string;
    public readonly street: string;
    public readonly city :string;
    public readonly state?: string | null;
    public readonly postalCode?: string | null;
    public readonly country: string;

    private constructor (input: CreateUserInput){
        this.firstName = input.firstName ?? null;
        this.middleName = input.middleName ?? null;
        this.lastName = input.lastName;
        this.email = input.email;
        this.phoneNumber = input.phoneNumber;
        this.street = input.street;
        this.city = input.city;
        this.state = input.state ?? null;
        this.postalCode = input.postalCode ?? null;
        this.country = input.country
    }

    public static fromValidationData(input: CreateUserInput): CreateUserCommand {
        return new CreateUserCommand(input)
    }
}