import { lambdaApiGatewayWrapper } from "./shared/lambda-apigateway-wrapper";
import { router } from "./router";

export const handler = lambdaApiGatewayWrapper.execute(router);
