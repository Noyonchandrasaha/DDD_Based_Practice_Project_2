// ============================================================
// FILE: src/infrastructure/events/EventBus.ts
// ============================================================

type EventHandler = (event: any) => Promise<void>;

export class EventBus {
  private handlers: Map<string, EventHandler[]> = new Map();

  subscribe(eventName: string, handler: EventHandler): void {
    if (!this.handlers.has(eventName)) {
      this.handlers.set(eventName, []);
    }
    this.handlers.get(eventName)!.push(handler);
  }

  async publish(events: any[]): Promise<void> {
    for (const event of events) {
      const handlers = this.handlers.get(event.eventName) || [];
      await Promise.all(handlers.map((h) => h(event)));
    }
  }

  async publishSingle(event: any): Promise<void> {
    const handlers = this.handlers.get(event.eventName) || [];
    await Promise.all(handlers.map((h) => h(event)));
  }
}
