// ============================================================
// FILE: src/modules/user/dto/CreateUser.dto.ts
// ============================================================
import { CreateUserInput } from '../validator/CreateUser.validator';

export class CreateUserDTO {
  private constructor(
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

  // ✅ FIX: Remove validation - data is already validated by middleware
  public static fromValidatedData(data: CreateUserInput): CreateUserDTO {
    return new CreateUserDTO(
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
    );
  }
}