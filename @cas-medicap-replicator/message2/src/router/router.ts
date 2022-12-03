import { z } from "zod";
import { injectable } from "tsyringe";
import { APIGatewayEvent } from "aws-lambda";
import { ValidationError } from "@package/error";
import { ApiGatewayWrapperHandler } from "@package/apigateway-wrapper";
import { BookingRoute } from "./booking-route";

@injectable()
export class Router implements ApiGatewayWrapperHandler {
  constructor(private bookingRoute: BookingRoute) {}

  async execute(event: APIGatewayEvent) {
    const body = this.bodyParser(event.body ?? "");

    if (!body.success) {
      throw new ValidationError().withInnerError(body.error);
    }

    switch (body.data.type) {
      case "RSV":
        await this.bookingRoute.execute(event);
        break;
      default:
        throw new ValidationError();
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "OK" }),
    };
  }

  private bodyParser(body: string) {
    const schema = z.object({
      type: z.string(),
      data: z.record(z.string(), z.any()),
    });

    return schema.safeParse(JSON.parse(body));
  }
}
