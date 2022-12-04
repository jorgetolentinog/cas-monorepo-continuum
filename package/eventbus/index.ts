import { EventBridgeEventBus } from "./eventbridge-eventbus";
import { MockEventBus } from "./mock-eventbus";

export const eventbus = process.env.IS_OFFLINE
  ? new MockEventBus()
  : new EventBridgeEventBus();
