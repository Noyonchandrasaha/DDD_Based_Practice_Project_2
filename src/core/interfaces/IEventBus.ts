// ============================================================================
// FILE: src/core/interfaces/IEventBus.ts
// ============================================================================

export interface IEventBus<TEventMap = Record<string, any>> {
  publish<K extends keyof TEventMap>(eventName: K, payload: TEventMap[K]): Promise<void>;
  subscribe<K extends keyof TEventMap>(eventName: K, handler: EventHandler<TEventMap[K]>): void;
  unsubscribe<K extends keyof TEventMap>(eventName: K, handler: EventHandler<TEventMap[K]>): void;
  clearSubscribers<K extends keyof TEventMap>(eventName: K): void;
  clearAllSubscribers(): void;
}

export type EventHandler<T = any> = (payload: T, meta?: EventMetadata) => Promise<void> | void;
export interface EventMetadata {
  timestamp: number;
  eventId?: string;
  [key: string]: any;
}
