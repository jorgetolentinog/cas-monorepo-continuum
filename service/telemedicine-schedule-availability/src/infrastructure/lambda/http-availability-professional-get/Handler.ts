import { AvailabilityProfessional } from "@/application/availability-professional/AvailabilityProfessional";
import { ValidationError } from "@/domain/errors/ValidationError";
import { APIGatewayEvent } from "aws-lambda";
import { injectable } from "tsyringe";
import { z } from "zod";
import { ApiGatewayWrapperHandler } from "../wrapper/ApiGatewayWrapper";

@injectable()
export class Handler implements ApiGatewayWrapperHandler {
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
