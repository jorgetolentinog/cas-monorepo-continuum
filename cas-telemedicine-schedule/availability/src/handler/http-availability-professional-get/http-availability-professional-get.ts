import { AvailabilityProfessional } from "../../usecase/availability-professional/availability-professional";
import { ValidationError } from "@package/error";
import { APIGatewayEvent } from "aws-lambda";
import { z } from "zod";
import { LambdaApiGatewayWrapperHandler } from "@package/lambda-apigateway-wrapper/wrapper";

export class HttpAvailabilityProfessionalGet
  implements LambdaApiGatewayWrapperHandler
{
  constructor(private availabilityProfessional: AvailabilityProfessional) {}

  async execute(event: APIGatewayEvent) {
    const request = this.requestParser({
      professionalId: event.pathParameters?.professionalId,
      startDate: event.queryStringParameters?.startDate,
      endDate: event.queryStringParameters?.endDate,
    });

    if (!request.success) {
      throw new ValidationError().withInnerError(request.error);
    }

    const response = await this.availabilityProfessional.execute({
      professionalId: request.data.professionalId,
      startDate: request.data.startDate,
      endDate: request.data.endDate,
    });

    return {
      statusCode: 200,
      body: JSON.stringify(response),
    };
  }

  private requestParser(params: object) {
    return z
      .object({
        professionalId: z.string(),
        startDate: z.string(),
        endDate: z.string(),
      })
      .safeParse(params);
  }
}
