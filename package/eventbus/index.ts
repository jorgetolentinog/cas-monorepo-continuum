import { EventBridgeEventBus } from "./EventBridgeEventBus";
import { MockEventBus } from "./MockEventBus";

export const eventbus = process.env.IS_OFFLINE
  ? new MockEventBus()
  : new EventBridgeEventBus();
