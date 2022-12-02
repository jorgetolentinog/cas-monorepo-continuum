import { container } from "@/infrastructure/injection";
import { ApiGatewayWrapper } from "../wrapper/ApiGatewayWrapper";
import { Handler } from "./Handler";

export const handler = container
  .resolve(ApiGatewayWrapper)
  .execute(container.resolve(Handler));
