// ============================================================
// FILE: src/modules/user/domain/events/UserSoftDeleted.event.ts
// ============================================================

import { BaseDomainEvent } from '@core/domain/events/BaseDomainEvent';

export interface UserSoftDeletedPayload {
    userId: string;
    deletedBy: string;
    deletedAt: Date;
    reason?: string;
}

export class UserSoftDeletedEvent extends BaseDomainEvent<UserSoftDeletedPayload> {
    public static readonly EVENT_NAME = 'UserSoftDeleted';

    constructor(payload: UserSoftDeletedPayload, metadata?: {correlationId?: string}){
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