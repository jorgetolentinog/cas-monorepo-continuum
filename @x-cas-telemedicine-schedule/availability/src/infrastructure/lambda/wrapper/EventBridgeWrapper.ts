import { Context, EventBridgeEvent } from "aws-lambda";
import { inject, injectable } from "tsyringe";
import { Logger } from "@/domain/ports/Logger";

@injectable()
export class EventBridgeWrapper {
  constructor(@inject("Logger") private logger: Logger) {}

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
