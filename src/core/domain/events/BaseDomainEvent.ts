// ============================================================
// FILE: src/core/domain/events/BaseDomainEvent.ts
// ============================================================

export abstract class BaseDomainEvent<T> {
  public readonly occurredAt: Date;
  public readonly eventId: string;
  public readonly payload: T;
  public readonly metadata?: { correlationId?: string };

  constructor(
    public readonly eventName: string,
    payload: T,
    metadata?: { correlationId?: string }
  ) {
    this.payload = structuredClone(payload);
    this.metadata = metadata ? structuredClone(metadata) : undefined;
    this.occurredAt = new Date();
    this.eventId = this.generateId();

    Object.freeze(this.payload);
    if (this.metadata) Object.freeze(this.metadata);
    Object.freeze(this);
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
  }
}