import { Context, EventBridgeEvent } from "aws-lambda";
import { Logger } from "@package/logger/logger";

export class LambdaEventBridgeWrapper {
  constructor(private logger: Logger) {}

  execute(handler: EventBridgeWrapperHandler) {
    return async (
      event: EventBridgeEvent<string, unknown>,
      context: Context
    ): Promise<void> => {
      try {
        this.logger.log("EventBridgeWrapper event", { event });
        await handler.execute(event, context);
      } catch (error) {
        this.logger.log("EventBridgeWrapper error", { error });
        throw error;
      }
    };
  }
}

export interface EventBridgeWrapperHandler {
  execute(
    event: EventBridgeEvent<string, unknown>,
    context: Context
  ): Promise<void>;
}
