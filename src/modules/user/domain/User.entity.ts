// ============================================================
// FILE: src/modules/user/domain/entities/User.entity.ts
// ============================================================

import { AggregateRoot } from '@core/domain/entities/AggregateRoot';
import { UserNameVO } from './value-objects/UserName.vo';
import { UserEmailVO } from './value-objects/UserEmail.vo';
import { PhoneNumberVO } from './value-objects/PhoneNumber.vo';
import { AddressVO } from './value-objects/Address.vo';
import { UserCreatedEvent } from './events/UserCreated.event';
import { UserActivatedEvent } from './events/UserActivated.event';
import { UserAddressUpdatedEvent } from './events/UserAddressUpdated.event';
import { UserDeactivatedEvent } from './events/UserDeactivated.event';
import { UserEmailUpdatedEvent } from './events/UserEmailUpdated.event';
import { UserNameUpdatedEvent } from './events/UserNameUpdated.event';
import { UserPhoneNumberUpdatedEvent } from './events/UserPhoneNumberUpdated.event';
import { UserSoftDeletedEvent } from './events/UserSoftDeleted.event';

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

    private constructor (props: UserProps) {
        super();
        this._name = props.name;
        this._email = props.email;
        this._phoneNumber = props.phoneNumber;
        this._address = props.address;
        this._isActive = props.isActive;
    }

    get name(): UserNameVO {
        return this._name;
    }

    get email(): UserEmailVO {
        return this._email;
    }

    get phoneNumber(): PhoneNumberVO {
        return this._phoneNumber;
    }

    get address(): AddressVO {
        return this._address;
    }

    get isActive(): boolean {
        return this._isActive;
    }

    static create(props: UserProps): User {
        const user = new User(props);
        (user as any).createdAt = new Date();
        (user as any).deletedAt = null;
        return user;
    }

    static reconstitute( props: UserProps & {id: string; createdAt: Date; updatedAt: Date; deletedAt?: Date | null}) : User {
        const user = Object.assign(
            new User({
                name: props.name,
                email: props.email,
                phoneNumber: props.phoneNumber,
                address: props.address,
                isActive: props.isActive,
            }),
            {
                id: props.id,
                createdAt: props.createdAt,
                updatedAt: props.updatedAt,
                deletedAt: props.deletedAt ?? null
            }
        )
        return user as User;
    }

    public markCreated(): void {
        this.addDomainEvent(
            new UserCreatedEvent({
                userId: this.id,
                fullname: this.name.fullName(),
                email: this.email.email,
                phoneNumber: this.phoneNumber.phoneNumber,
                street: this.address.street,
                city: this.address.city,
                state: this.address.state,
                postalCode: this.address.postalCode,
                country: this.address.country,
                isActive: this.isActive,
            })
        )
    }

    updateName(newName: UserNameVO): void {
        // If the name didn’t actually change, do nothing
        if (this._name.equals(newName)) return;

        // Store the old values before updating
        const oldFirstName = this._name.firstName;
        const oldMiddleName = this._name.middleName;
        const oldLastName = this._name.lastName ?? '';

        // Update the internal name
        this._name = newName;

        // Add a domain event to track this change
        this.addDomainEvent(
            new UserNameUpdatedEvent({
                userId: this.id,
                oldFirstName: oldFirstName,
                oldMiddleName: oldMiddleName,
                oldLastName: oldLastName,
                newFirstName: newName.firstName,
                newMiddleName: newName.middleName,
                newLastName: newName.lastName ?? '',
                updatedAt: new Date()
            })
        );
    }

    updateAddress(newAddress: AddressVO): void {
        // If the address hasn’t changed, do nothing
        if (this._address.equals(newAddress)) return;

        // Store the old address before updating
        const oldAddress = this._address.fullAddress();

        // Update the address value object
        this._address = newAddress;

        // Emit a domain event describing the change
        this.addDomainEvent(
            new UserAddressUpdatedEvent({
                userId: this.id,
                oldAddress,
                newAddress: newAddress.fullAddress(),
                updatedAt: new Date(),
            })
        );

        // Optionally, update entity timestamp
        (this as any).updatedAt = new Date();
    }
    updateEmail(newEmail: UserEmailVO): void {
        // If the email hasn’t changed, do nothing
        if (this._email.equals(newEmail)) return;

        // Store the old email before updating
        const oldEmail = this._email.email;

        // Update the email value object
        this._email = newEmail;

        // Emit a domain event describing the change
        this.addDomainEvent(
            new UserEmailUpdatedEvent({
                userId: this.id,
                oldEmail,
                newEmail: newEmail.email,
                updatedAt: new Date(),
            })
        );

        // Optionally, update entity timestamp
        (this as any).updatedAt = new Date();
    }

    updatePhoneNumber(newPhoneNumber: PhoneNumberVO): void {
        // If the phone number hasn’t changed, do nothing
        if (this._phoneNumber.equals(newPhoneNumber)) return;

        // Store the old phone number before updating
        const oldPhoneNumber = this._phoneNumber.phoneNumber;

        // Update the phone number value object
        this._phoneNumber = newPhoneNumber;

        // Emit a domain event describing the change
        this.addDomainEvent(
            new UserPhoneNumberUpdatedEvent({
                userId: this.id,
                oldPhoneNumber,
                newPhoneNumber: newPhoneNumber.phoneNumber,
                updatedAt: new Date(),
            })
        );

        // Optionally, update entity timestamp
        (this as any).updatedAt = new Date();
    }

    activate(activatedBy: string = 'system'): void {
        // If the user is already active, do nothing
        if (this._isActive) return;

        // Activate the user
        this._isActive = true;

        // Emit a domain event describing the activation
        this.addDomainEvent(
            new UserActivatedEvent({
                userId: this.id,
                activatedBy,
                activatedAt: new Date(),
            })
        );

        // Optionally, update entity timestamp
        (this as any).updatedAt = new Date();
    }

    deactivate(reason: string = 'user-requested'): void {
        // If the user is already inactive, do nothing
        if (!this._isActive) return;

        // Deactivate the user
        this._isActive = false;

        // Emit a domain event describing the deactivation
        this.addDomainEvent(
            new UserDeactivatedEvent({
                userId: this.id,
                reason,
                deactivatedAt: new Date(),
            })
        );

        // Optionally, update entity timestamp
        (this as any).updatedAt = new Date();
    }

    delete(deletedBy: string = 'user-self', reason?: string): void {
        // Soft delete the entity
        this.softDelete();

        // Emit a domain event describing the deletion
        this.addDomainEvent(
            new UserSoftDeletedEvent({
                userId: this.id,
                deletedBy,
                deletedAt: new Date(),
                reason,
            })
        );

        // Optionally, update entity timestamp
        (this as any).updatedAt = new Date();
    }

    toPrimitives() {
        return {
        id: (this as any).id,
        name: this._name.fullName(),
        email: this._email.email,
        phoneNumber: this._phoneNumber.phoneNumber,
        address: this._address.fullAddress(),
        isActive: this._isActive,
        createdAt: (this as any).createdAt,
        updatedAt: (this as any).updatedAt,
        deletedAt: (this as any).deletedAt ?? null
        };
    }


}
