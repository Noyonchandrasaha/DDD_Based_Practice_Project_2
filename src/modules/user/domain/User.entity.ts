// ============================================================
// FILE: src/modules/user/domain/entities/User.entity.ts
// ============================================================

import { AggregateRoot } from '@/core/domain/entities/AggregateRoot';
import { UserNameVO } from './value-objects/UserName.vo';
import { UserEmailVO } from './value-objects/UserEmail.vo';
import { PhoneNumberVO } from './value-objects/PhoneNumber.vo';
import { AddressVO } from './value-objects/Address.vo';
import { UserCreatedEvent } from './events/UserCreated.event';
import { UserAddressUpdatedEvent } from './events/UserAddressUpdated.event';
import { UserActivatedEvent } from './events/UserActivated.event';
import { UserDeactivatedEvent } from './events/UserDeactivated.event';
import { UserEmailUpdatedEvent } from './events/UserEmailUpdated.event';
import { UserNameUpdatedEvent } from './events/UserNameUpdated.event';
import { UserPhoneNumberUpdatedEvent } from './events/UserPhoneNumberUpdated.event';
import { UserSoftDeletedEvent } from './events/UserSoftDeleted.event'

export interface UserProps {
  name: UserNameVO;
  email: UserEmailVO;
  phoneNumber: PhoneNumberVO;
  address: AddressVO;
  isActive: boolean;
}

export class User extends AggregateRoot {
  private _name: UserNameVO;
  private _email: UserEmailVO;
  private _phoneNumber: PhoneNumberVO;
  private _address: AddressVO;
  private _isActive: boolean;

  private constructor(props: UserProps) {
    super();
    this._name = props.name;
    this._email = props.email;
    this._phoneNumber = props.phoneNumber;
    this._address = props.address;
    this._isActive = props.isActive;
  }

  // ==================== Factory Methods ====================

  static create(props: UserProps): User {
    const user = new User(props);

    // ---- set audit fields (BaseEntity) ----
    (user as any).id = crypto.randomUUID();
    (user as any).createdAt = new Date();
    (user as any).updatedAt = new Date();

    // ---- emit only UserCreatedEvent ----
    user.addDomainEvent(
      new UserCreatedEvent({
        userId: (user as any).id,
        fullName: user.name.fullName(),
        email: user.email.email,
        phoneNumber: user.phoneNumber.phoneNumber,
        address: user.address.fullAddress(),   // <-- exact string from VO
        isActive: user.isActive,
      })
    );

    return user;
  }

  static reconstitute(
    props: UserProps & { id: string; createdAt: Date; updatedAt: Date }
  ): User {
    const user = Object.assign(new User({
      name: props.name,
      email: props.email,
      phoneNumber: props.phoneNumber,
      address: props.address,
      isActive: props.isActive,
    }), {
      id: props.id,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
    });

    return user as User;
  }

  // ==================== Getters ====================

  get name(): UserNameVO { return this._name; }
  get email(): UserEmailVO { return this._email; }
  get phoneNumber(): PhoneNumberVO { return this._phoneNumber; }
  get address(): AddressVO { return this._address; }
  get isActive(): boolean { return this._isActive; }

  // ==================== Domain Behaviors (No Events) ====================

  updateName(newName: UserNameVO): void {
    if (this._name.equals(newName)) return;
    const oldFullName = this._name.fullName();

    this._name = newName;

    this.addDomainEvent(
        new UserNameUpdatedEvent(
            {
                userId: this.id,
                oldFullName,
                newFullName: newName.fullName(),
                updatedAt: new Date()
            }
        )
    )
  }

  updateEmail(newEmail: UserEmailVO): void {
    if (this._email.equals(newEmail)) return;
    const oldEmail = this._email.email;
    this._email = newEmail;
    this.addDomainEvent(
        new UserEmailUpdatedEvent(
            {
                userId: this.id,
                oldEmail,
                newEmail: newEmail.email,
                updatedAt: new Date(),
            }
        )
    )
  }

  updatePhoneNumber(newPhoneNumber: PhoneNumberVO): void {
    if (this._phoneNumber.equals(newPhoneNumber)) return;
    const oldPhoneNumber = this._phoneNumber.phoneNumber;
    this._phoneNumber = newPhoneNumber;
    this.addDomainEvent(
        new UserPhoneNumberUpdatedEvent({
            userId: this.id,
            oldPhoneNumber,
            newPhoneNumber: newPhoneNumber.phoneNumber,
            updatedAt: new Date()
        })
    )
  }

  updateAddress(newAddress: AddressVO): void {
    if (this._address.equals(newAddress)) return;
    const oldAddress = this._address.fullAddress();
    this._address = newAddress;
    this.addDomainEvent(
        new UserAddressUpdatedEvent({
            userId: this.id,
            oldAddress,
            newAddress: newAddress.fullAddress(),
            updatedAt: new Date()
        })
    )
  }

  activate(activatedBy:string="User"): void {
    if (this._isActive) return;
    this._isActive = true;
    this.addDomainEvent(
        new UserActivatedEvent({
            userId: this.id,
            activatedBy,
            activatedAt: new Date()
        })
    )
  }

  deactivate( reason: string ="user-requested" ): void {
    if (!this._isActive) return;
    this._isActive = false;
    this.addDomainEvent(
        new UserDeactivatedEvent({
            userId: this.id,
            reason,
            deactivatedAt: new Date()
        })
    )
  }

  delete(deletedBy: string ="user-self", reason?:string): void {
    this.softDelete();
    this.addDomainEvent(
        new UserSoftDeletedEvent({
            userId: this.id,
            deletedBy,
            reason,
            deletedAt: new Date()
        })
    )
  }

  // ==================== Utility ====================

  toPrimitives() {
    return {
      id: (this as any).id,
      name: this._name.fullName(),
      email: this._email.email,                // <-- primitive
      phoneNumber: this._phoneNumber.phoneNumber, // <-- primitive
      address: this._address.fullAddress(),    // <-- exact string
      isActive: this._isActive,
      createdAt: (this as any).createdAt,
      updatedAt: (this as any).updatedAt,
    };
  }
}