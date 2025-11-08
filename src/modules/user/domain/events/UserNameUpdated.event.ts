// ============================================================
// FILE: src/modules/user/domain/events/UserNameUpdated.event.ts
// ============================================================

import { BaseDomainEvent } from '../../../../core/domain/events/BaseDomainEvent';

export interface UserNameUpdatedPayload {
  userId: string;
  oldFullName: string;
  newFullName: string;
  updatedAt: Date;
}

export class UserNameUpdatedEvent extends BaseDomainEvent<UserNameUpdatedPayload> {
  public static readonly EVENT_NAME = 'UserNameUpdated';

  constructor(
    payload: UserNameUpdatedPayload,
    metadata?: { correlationId?: string }
  ) {
    super(UserNameUpdatedEvent.EVENT_NAME, payload, metadata);
  }

  get userId(): string {
    return this.payload.userId;
  }

  get oldFullName(): string {
    return this.payload.oldFullName;
  }

  get newFullName(): string {
    return this.payload.newFullName;
  }

  get updatedAt(): Date {
    return this.payload.updatedAt;
  }
}