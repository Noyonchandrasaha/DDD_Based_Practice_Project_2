// ============================================================
// FILE: src/modules/user/domain/events/UserAddressUpdated.event.ts
// ============================================================

import { BaseDomainEvent } from '../../../../core/domain/events/BaseDomainEvent';

export interface UserAddressUpdatedPayload {
  userId: string;
  oldAddress: string;     // fullAddress() string
  newAddress: string;     // fullAddress() string
  updatedAt: Date;
}

export class UserAddressUpdatedEvent extends BaseDomainEvent<UserAddressUpdatedPayload> {
  public static readonly EVENT_NAME = 'UserAddressUpdated';

  constructor(
    payload: UserAddressUpdatedPayload,
    metadata?: { correlationId?: string }
  ) {
    super(UserAddressUpdatedEvent.EVENT_NAME, payload, metadata);
  }

  get userId(): string {
    return this.payload.userId;
  }

  get oldAddress(): string {
    return this.payload.oldAddress;
  }

  get newAddress(): string {
    return this.payload.newAddress;
  }

  get updatedAt(): Date {
    return this.payload.updatedAt;
  }
}