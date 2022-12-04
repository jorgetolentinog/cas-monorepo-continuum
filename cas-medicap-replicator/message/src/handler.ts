import { lambdaApiGatewayWrapper } from "@package/lambda-apigateway-wrapper";
import { router } from "./router";

export const handler = lambdaApiGatewayWrapper.execute(router);
