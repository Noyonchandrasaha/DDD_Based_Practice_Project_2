// ============================================================
// FILE: src/core/abstracts/AggregateRoot.ts
// ============================================================

import { BaseEntity } from './Entity';

export abstract class AggregateRoot<T = any> extends BaseEntity {
    private domainEvents: T[] = [];

    protected addDomainEvent(event: T): void {
        this.domainEvents.push(event);
    }

    getDomainEvents(): T[] {
        return this.domainEvents
    }

    clearDomainEvents(): void {
        this.domainEvents = [];
    }
}