// ============================================================
// FILE: src/modules/user/domain/events/UserCreated.event.spec.ts
// ============================================================

import { UserCreatedPayload, UserCreatedEvent } from '../../../../../modules/user/domain/events/UserCreated.event';
import { BaseDomainEvent } from '../../../../../core/domain/events/BaseDomainEvent'

describe('UserCreatedEvent', () => {
  const mockPayload: UserCreatedPayload = {
    userId: "68ff3b920c1807a842c04bf2", // MongoDB ObjectId as string
    fullName: 'John Doe',
    email: 'john@example.com',
    phoneNumber: '+15551234567',
    address: '123 Main St, New York, USA',
    isActive: true,
  };

  const mockMetadata = { correlationId: 'corr-456' };

  it('should create event with correct eventName', () => {
    const event = new UserCreatedEvent(mockPayload);
    expect(event.eventName).toBe('UserCreated');
  });

  it('should set payload correctly', () => {
    const event = new UserCreatedEvent(mockPayload);
    expect(event.payload).toEqual(mockPayload);
  });

  it('should generate unique eventId', () => {
    const event1 = new UserCreatedEvent(mockPayload);
    const event2 = new UserCreatedEvent(mockPayload);
    expect(event1.eventId).not.toBe(event2.eventId);
    expect(event1.eventId).toMatch(/^\d+-[a-z0-9]+$/);
  });

  it('should set occurredAt to current time (within 100ms)', () => {
    const before = Date.now();
    const event = new UserCreatedEvent(mockPayload);
    const after = Date.now();
    const eventTime = event.occurredAt.getTime();
    expect(eventTime).toBeGreaterThanOrEqual(before);
    expect(eventTime).toBeLessThanOrEqual(after + 100);
  });

  it('should include metadata when provided', () => {
    const event = new UserCreatedEvent(mockPayload, mockMetadata);
    expect(event.metadata).toEqual(mockMetadata);
  });

  it('should set metadata to undefined when not provided', () => {
    const event = new UserCreatedEvent(mockPayload);
    expect(event.metadata).toBeUndefined();
  });

  it('should allow partial metadata', () => {
    const event = new UserCreatedEvent(mockPayload, { correlationId: 'corr-789' });
    expect(event.metadata!.correlationId).toBe('corr-789'); // ! = non-null assertion
  });

  it('should not allow mutation of payload', () => {
    const event = new UserCreatedEvent(mockPayload);
    expect(() => {
      // @ts-ignore
      event.payload.userId = 'hacked';
    }).toThrow(TypeError);
  });

  it('should not allow mutation of metadata', () => {
    const event = new UserCreatedEvent(mockPayload, mockMetadata);
    expect(() => {
      // @ts-ignore
      event.metadata!.correlationId = 'hacked';
    }).toThrow(TypeError);
  });

  it('should freeze payload and metadata', () => {
    const mutablePayload: UserCreatedPayload = {
      userId: "68ff3b920c1807a842c04bf2",
      fullName: 'John Doe',
      email: 'john@example.com',
      phoneNumber: '+15551234567',
      address: '123 Main St, New York, USA',
      isActive: true,
    };
    const mutableMetadata = { correlationId: 'corr-456' };

    const event = new UserCreatedEvent(mutablePayload, mutableMetadata);

    // Mutate originals — should NOT affect event
    mutablePayload.userId = 'external-hack';
    mutableMetadata.correlationId = 'external-hack';

    expect(event.payload.userId).toBe("68ff3b920c1807a842c04bf2");
    expect(event.metadata!.correlationId).toBe('corr-456');
  });

  it('should inherit from BaseDomainEvent', () => {
    const event = new UserCreatedEvent(mockPayload);
    expect(event).toBeInstanceOf(BaseDomainEvent);
  });

  it('should have readonly properties', () => {
    const event = new UserCreatedEvent(mockPayload);
    // @ts-ignore
    expect(() => { event.eventName = 'Hacked'; }).toThrow();
    // @ts-ignore
    expect(() => { event.occurredAt = new Date(); }).toThrow();
    // @ts-ignore
    expect(() => { event.eventId = 'hacked'; }).toThrow();
  });

  it('should handle empty metadata object', () => {
    const event = new UserCreatedEvent(mockPayload, {});
    expect(event.metadata).toEqual({});
  });

  it('should generate eventId with timestamp prefix', () => {
    const before = Date.now();
    const event = new UserCreatedEvent(mockPayload);
    const timestampPart = parseInt(event.eventId.split('-')[0], 10);
    expect(timestampPart).toBeGreaterThanOrEqual(before);
  });
});