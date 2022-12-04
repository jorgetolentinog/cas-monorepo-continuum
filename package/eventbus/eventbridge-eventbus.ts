import { EventBus, EventBusMessage } from "./eventbus";
import { AWSType, AWS } from "@package/aws-sdk-with-xray";

export class EventBridgeEventBus implements EventBus {
  private readonly _eventBridge: AWSType.EventBridge;

  constructor() {
    this._eventBridge = new AWS.EventBridge();
  }

  async publish(message: EventBusMessage): Promise<void> {
    const timestamp = new Date().toISOString();

    await this._eventBridge
      .putEvents({
        Entries: [
          {
            EventBusName: process.env.EVENT_BUS_NAME,
            Source: process.env.SERVICE_NAME,
            DetailType: message.eventType,
            Time: new Date(timestamp),
            Detail: JSON.stringify({
              occurredAt: timestamp,
              ...message,
            }),
          },
        ],
      })
      .promise();
  }
}
