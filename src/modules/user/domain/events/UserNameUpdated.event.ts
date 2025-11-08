// ============================================================
// FILE: src/modules/user/domain/events/UserNameUpdated.event.ts
// ============================================================

import { BaseDomainEvent } from '@core/domain/events/BaseDomainEvent';

export interface UserNameUpdatedPayload {
    userId: string;
    oldFirstName?: string;
    oldMiddleName?: string;
    oldLastName: string;
    newFirstName?: string;
    newMiddleName?: string;
    newLastName: string;
    updatedAt: Date;
}

export class UserNameUpdatedEvent extends BaseDomainEvent<UserNameUpdatedPayload> {
    public static readonly EVENT_NAME: 'UserNameUpdated';

    constructor(payload: UserNameUpdatedPayload, metadata?: {correlationId?: string}){
        super(UserNameUpdatedEvent.EVENT_NAME, payload, metadata);
    }

    get userId(): string {
        return this.payload.userId;
    }

    get oldFirstName(): string | undefined {
        return this.payload.oldFirstName;
    }

    get oldMiddleName(): string | undefined {
        return this.payload.oldMiddleName;
    }

    get oldLastName(): string {
        return this.payload.oldLastName;
    }

    get newFirstName(): string | undefined {
        return this.payload.newFirstName;
    }

    get newMiddleName(): string | undefined {
        return this.payload.newMiddleName;
    }

    get newLastName(): string {
        return this.payload.newLastName;
    }

    get updatedAt(): Date {
        return this.payload.updatedAt;
    }
}