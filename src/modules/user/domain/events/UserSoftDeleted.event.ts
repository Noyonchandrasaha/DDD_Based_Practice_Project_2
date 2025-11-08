// ============================================================
// FILE: src/modules/user/domain/events/UserSoftDeleted.event.ts
// ============================================================

import { BaseDomainEvent } from '@/core/domain/events/BaseDomainEvent';

export interface UserSoftDeletedPayload {
  userId: string;
  deletedBy: string;     // e.g., 'user-self', 'admin-456', 'system-expiry'
  deletedAt: Date;
  reason?: string;       // optional: 'user-requested', 'gdpr', 'inactivity'
}

export class UserSoftDeletedEvent extends BaseDomainEvent<UserSoftDeletedPayload> {
  public static readonly EVENT_NAME = 'UserSoftDeleted';

  constructor(
    payload: UserSoftDeletedPayload,
    metadata?: { correlationId?: string }
  ) {
    super(UserSoftDeletedEvent.EVENT_NAME, payload, metadata);
  }

  get userId(): string {
    return this.payload.userId;
  }

  get deletedBy(): string {
    return this.payload.deletedBy;
  }

  get deletedAt(): Date {
    return this.payload.deletedAt;
  }

  get reason(): string | undefined {
    return this.payload.reason;
  }
}