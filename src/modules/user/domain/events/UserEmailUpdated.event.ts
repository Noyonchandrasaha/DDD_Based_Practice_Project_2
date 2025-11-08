// ============================================================
// FILE: src/modules/user/domain/events/UserEmailUpdated.event.ts
// ============================================================

import { BaseDomainEvent } from '../../../../core/domain/events/BaseDomainEvent';

export interface UserEmailUpdatedPayload {
  userId: string;
  oldEmail: string;
  newEmail: string;
  updatedAt: Date;
}

export class UserEmailUpdatedEvent extends BaseDomainEvent<UserEmailUpdatedPayload> {
  public static readonly EVENT_NAME = 'UserEmailUpdated';

  constructor(
    payload: UserEmailUpdatedPayload,
    metadata?: { correlationId?: string }
  ) {
    super(UserEmailUpdatedEvent.EVENT_NAME, payload, metadata);
  }

  get userId(): string {
    return this.payload.userId;
  }

  get oldEmail(): string {
    return this.payload.oldEmail;
  }

  get newEmail(): string {
    return this.payload.newEmail;
  }

  get updatedAt(): Date {
    return this.payload.updatedAt;
  }
}