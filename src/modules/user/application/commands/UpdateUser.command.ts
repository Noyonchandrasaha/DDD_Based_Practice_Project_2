// ============================================================
// FILE: src/modules/user/application/commands/UpdateUser.command.ts
// ============================================================

import { UpdateUserInput } from '../../validator/UpdateUser.validator';

export class UpdateUserCommand {
    public readonly firstName?: string | null;
    public readonly middleName?: string | null;
    public readonly lastName?: string | null;
    public readonly email?: string | null;
    public readonly phoneNumber?: string | null;
    public readonly street?: string | null;
    public readonly city?: string | null;
    public readonly state?: string | null;
    public readonly postalCode?: string | null;
    public readonly country?: string | null;
    public readonly isActive?: boolean;

    private constructor(input: UpdateUserInput){
        this.firstName = input.firstName ?? null;
        this.middleName = input.middleName ?? null;
        this.lastName = input.lastName ?? null;
        this.email = input.email ?? null;
        this.phoneNumber = input.phoneNumber ?? null;
        this.street = input.street ?? null;
        this.city = input.city ?? null;
        this.state = input.state ?? null;
        this.postalCode = input.state ?? null;
        this.country = input.country ?? null;
        this.isActive = input.isActive;
    }

    public static fromValidaedDate(input: UpdateUserInput): UpdateUserCommand {
        return new UpdateUserCommand(input)
    }
}