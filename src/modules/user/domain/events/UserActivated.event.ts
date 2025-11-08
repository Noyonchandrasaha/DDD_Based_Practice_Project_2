// ============================================================
// FILE: src/modules/user/domain/events/UserActivated.event.ts
// ============================================================

import { BaseDomainEvent } from '@core/domain/events/BaseDomainEvent';

export interface UserActivatedPayload {
    userId: string;
    activatedBy?: string;
    activatedAt: Date;
}

export class UserActivatedEvent extends BaseDomainEvent<UserActivatedPayload> {
    public static readonly EVENT_NAME = 'UserActivated';

    constructor (payload: UserActivatedPayload, metadata?: {correlationId?: string}) {
        super(UserActivatedEvent.EVENT_NAME, payload, metadata)
    }

    get userId(): string {
        return this.payload.userId;
    }

    get activatedBy(): string | undefined {
        return this.payload.activatedBy
    }

    get actovatedAt(): Date {
        return this.payload.activatedAt
    }
}