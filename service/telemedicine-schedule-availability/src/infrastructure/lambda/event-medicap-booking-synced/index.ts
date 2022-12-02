import { container } from "@/infrastructure/injection";
import { EventBridgeWrapper } from "../wrapper/EventBridgeWrapper";
import { Handler } from "./Handler";

export const handler = container
  .resolve(EventBridgeWrapper)
  .execute(container.resolve(Handler));
