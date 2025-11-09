// ============================================================
// FILE: src/modules/user/domain/events/UserCreated.event.ts
// ============================================================

import { BaseDomainEvent } from '@core/domain/events/BaseDomainEvent';

export interface UserCreatedPayload {
    userId: string;
    fullname: string;
    email: string;
    phoneNumber: string;
    street: string;
    city: string;
    state?: string;
    postalCode?: string;
    country: string;
    isActive: boolean;
}

export class UserCreatedEvent extends BaseDomainEvent<UserCreatedPayload> {
    public static readonly EVENT_NAME = 'UserCreated';

    constructor(payload: UserCreatedPayload, metadata?: {correlationId?: string}) {
        super(UserCreatedEvent.EVENT_NAME, payload, metadata)
    }

    get userId(): string {
        return this.payload.userId;
    }

    get fullName(): string {
        return this.payload.fullname;
    }

    get email(): string {
        return this.payload.email;
    }

    get phoneNumber(): string {
        return this.payload.phoneNumber;
    }

    get street(): string {
        return this.payload.street;
    }

    get city(): string {
        return this.payload.city;
    }
    
    get state(): string | undefined {
        return this.payload.state;
    }

    get postalCode(): string | undefined {
        return this.payload.postalCode;
    }

    get conuntry(): string {
        return this.payload.country;
    }

    get isActive(): boolean {
        return this.payload.isActive;
    }
}