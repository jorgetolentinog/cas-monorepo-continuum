import { LambdaEventBridgeWrapper } from "./wrapper";
import { logger } from "@package/logger";

export const lambdaEventBridgeWrapper = new LambdaEventBridgeWrapper(logger);
