import { EventBus } from "./EventBus";

export class MockEventBus implements EventBus {
  async publish(): Promise<void> {
    // do nothing
  }
}
