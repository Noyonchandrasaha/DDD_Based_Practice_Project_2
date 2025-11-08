// ============================================================
// FILE: src/modules/user/domain/events/UserPhoneNumberUpdated.event.ts
// ============================================================

import { BaseDomainEvent } from '../../../../core/domain/events/BaseDomainEvent';

export interface UserPhoneNumberUpdatedPayload {
  userId: string;
  oldPhoneNumber: string;
  newPhoneNumber: string;
  updatedAt: Date;
}

export class UserPhoneNumberUpdatedEvent extends BaseDomainEvent<UserPhoneNumberUpdatedPayload> {
  public static readonly EVENT_NAME = 'UserPhoneNumberUpdated';

  constructor(
    payload: UserPhoneNumberUpdatedPayload,
    metadata?: { correlationId?: string }
  ) {
    super(UserPhoneNumberUpdatedEvent.EVENT_NAME, payload, metadata);
  }

  get userId(): string {
    return this.payload.userId;
  }

  get oldPhoneNumber(): string {
    return this.payload.oldPhoneNumber;
  }

  get newPhoneNumber(): string {
    return this.payload.newPhoneNumber;
  }

  get updatedAt(): Date {
    return this.payload.updatedAt;
  }
}