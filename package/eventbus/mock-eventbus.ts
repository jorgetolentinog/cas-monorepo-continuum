import { EventBus } from "./eventbus";

export class MockEventBus implements EventBus {
  async publish(): Promise<void> {
    // do nothing
  }
}
