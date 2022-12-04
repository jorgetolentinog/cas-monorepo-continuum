import { LambdaApiGatewayWrapper } from "./wrapper";
import { logger } from "@package/logger";

export const lambdaApiGatewayWrapper = new LambdaApiGatewayWrapper(logger);
