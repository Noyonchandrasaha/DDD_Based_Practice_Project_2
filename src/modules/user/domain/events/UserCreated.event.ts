// ============================================================
// FILE: src/modules/user/domain/events/UserCreated.event.ts
// ============================================================

import { BaseDomainEvent } from '../../../../core/domain/events/BaseDomainEvent';

export interface UserCreatedPayload {
  userId: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  address: string;
  isActive: boolean;
}

export class UserCreatedEvent extends BaseDomainEvent<UserCreatedPayload> {
  public static readonly EVENT_NAME = 'UserCreated';

  constructor(
    payload: UserCreatedPayload,
    metadata?: { correlationId?: string }
  ) {
    super(UserCreatedEvent.EVENT_NAME, payload, metadata);
  }

  get userId(): string {
    return this.payload.userId;
  }

  get fullName(): string {
    return this.payload.fullName;
  }

  get email(): string {
    return this.payload.email;
  }

  get phoneNumber(): string {
    return this.payload.phoneNumber;
  }

  get address(): string {
    return this.payload.address;
  }

  get isActive(): boolean {
    return this.payload.isActive;
  }
}