import { LambdaApiGatewayWrapper } from "./wrapper";
import { logger } from "../logger";

export const lambdaApiGatewayWrapper = new LambdaApiGatewayWrapper(logger);
