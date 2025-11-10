// ============================================================
// FILE: src/modules/user/application/use-cases/UpdateUser.usecase.ts
// ============================================================

import { User } from '../../domain/User.entity';
import { UserRepository } from '../../repository/User.repository';

import { UpdateUserDTO } from '../../dto/UpdateUser.dto';
import { UpdateUserInput } from '../../validator/UpdateUser.validator';

import { UserNameVO } from '../../domain/value-objects/UserName.vo';
import { UserEmailVO } from '../../domain/value-objects/UserEmail.vo';
import { PhoneNumberVO } from '../../domain/value-objects/PhoneNumber.vo';
import { AddressVO } from '../../domain/value-objects/Address.vo';

// Keep this import path/name consistent with your project
import { makeUserEmailUniqueSpec } from '../../domain/specifications/UserEmailUniqueSpec';

export class UserUpdateUseCase {
  constructor(private readonly userRepo: UserRepository) {}

  private toUndef(v: string | null | undefined): string | undefined {
    if (v == null) return undefined;
    const s = v.trim();
    return s === '' ? undefined : s;
  }

  async execute(id: string, input: UpdateUserInput): Promise<User> {
    const current = await this.userRepo.findById(id);
    if (!current) throw new Error('User not found');

    const deletedAt = (current as any).deletedAt ?? null;
    if (deletedAt) throw new Error('User is soft-deleted');

    const dto = UpdateUserDTO.fromValidatedDate({
      firstName:   input.firstName   ?? undefined,
      middleName:  input.middleName  ?? undefined,
      lastName:    input.lastName    ?? undefined,
      email:       input.email       ?? undefined,
      phoneNumber: input.phoneNumber ?? undefined,
      street:      input.street      ?? undefined,
      city:        input.city        ?? undefined,
      state:       input.state       ?? undefined,
      postalCode:  input.postalCode  ?? undefined,
      country:     input.country     ?? undefined,
      isActive:    input.isActive    ?? undefined,
    });

    if (dto.email != null) {
      await makeUserEmailUniqueSpec(this.userRepo, id).assert(dto.email);
    }


    // ---- Name ----
    const wantsNameChange =
      dto.firstName !== undefined ||
      dto.middleName !== undefined ||
      dto.lastName !== undefined;

    if (wantsNameChange) {
      const lastName = (dto.lastName ?? current.name.lastName).trim();
      const firstName = this.toUndef(dto.firstName ?? current.name.firstName);
      const middleName = this.toUndef(dto.middleName ?? current.name.middleName);

      if (!lastName) throw new Error('lastName is required');
      current.updateName(UserNameVO.create(lastName, firstName, middleName));
    }

    // ---- Email ----
    if (dto.email != null) {
      const email = dto.email.trim();
      if (!email) throw new Error('email cannot be empty');
      current.updateEmail(UserEmailVO.create(email));
    }

    // ---- Phone ----
    if (dto.phoneNumber != null) {
      const phone = dto.phoneNumber.trim();
      if (!phone) throw new Error('phoneNumber cannot be empty');
      current.updatePhoneNumber(PhoneNumberVO.create(phone));
    }

    // ---- Address ----
    const wantsAddressChange =
      dto.street !== undefined ||
      dto.city !== undefined ||
      dto.state !== undefined ||
      dto.postalCode !== undefined ||
      dto.country !== undefined;

    if (wantsAddressChange) {
      const street = (dto.street ?? current.address.street).trim();
      const city = (dto.city ?? current.address.city).trim();
      const country = (dto.country ?? current.address.country).trim();
      const state = this.toUndef(dto.state ?? current.address.state);
      const postalCode = this.toUndef(dto.postalCode ?? current.address.postalCode);

      if (!street || !city || !country) {
        throw new Error('street, city, and country are required');
      }
      current.updateAddress(
        AddressVO.create(street, city, country, state, postalCode)
      );
    }

    // ---- isActive ----
    if (dto.isActive !== undefined) {
      dto.isActive ? current.activate('system') : current.deactivate('system');
    }

    // 6) Persist the aggregate's new state
    const props = {
      name: current.name,
      email: current.email,
      phoneNumber: current.phoneNumber,
      address: current.address,
      isActive: current.isActive,
    };

    const updated = await this.userRepo.update(id, props);
    return updated;
  }
}
