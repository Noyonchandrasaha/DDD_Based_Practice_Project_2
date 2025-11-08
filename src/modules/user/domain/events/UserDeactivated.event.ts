// ============================================================
// FILE: src/modules/user/domain/events/UserDeactivated.event.ts
// ============================================================

import { BaseDomainEvent } from '@core/domain/events/BaseDomainEvent';

export interface UserDeactivatedPayload {
    userId: string;
    reason: string;
    deactivatedAt: Date;
}

export class UserDeactivatedEvent extends BaseDomainEvent<UserDeactivatedPayload> {
    public static readonly EVENT_NAME = 'UserDeactivated';

    constructor (payload: UserDeactivatedPayload, metadata?: {correlationId?: string}) {
        super(UserDeactivatedEvent.EVENT_NAME, payload, metadata)
    }

    get userId(): string {
        return this.payload.userId;
    }

    get reason(): string {
        return this.payload.reason;
    }

    get deactovatedAt(): Date {
        return this.payload.deactivatedAt;
    }
}