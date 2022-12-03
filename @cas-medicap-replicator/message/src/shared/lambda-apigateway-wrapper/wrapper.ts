import { APIGatewayEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { ValidationError } from "@package/error";
import { Logger } from "../logger/logger";

export class LambdaApiGatewayWrapper {
  constructor(private logger: Logger) {}

  execute(handler: LambdaApiGatewayWrapperHandler) {
    return async (
      event: APIGatewayEvent,
      context: Context
    ): Promise<APIGatewayProxyResult> => {
      let result: APIGatewayProxyResult;

      try {
        this.logger.log("ApiGatewayWrapper event", { event });
        result = await handler.execute(event, context);
      } catch (error) {
        this.logger.log("ApiGatewayWrapper error", { error });

        let status = 500;
        let message = "Server Error";
        if (error instanceof ValidationError) {
          status = 400;
          message = error.message;
        }

        result = {
          statusCode: status,
          body: JSON.stringify({
            message,
            timestamp: new Date().toISOString(),
          }),
        };
      }

      return {
        ...result,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true,
          ...result.headers,
        },
      };
    };
  }
}

export interface LambdaApiGatewayWrapperHandler {
  execute(
    event: APIGatewayEvent,
    context: Context
  ): Promise<APIGatewayProxyResult>;
}
