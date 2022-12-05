import { lambdaApiGatewayWrapper } from "@package/lambda-apigateway-wrapper";
import { HttpAvailabilityProfessionalGet } from "./http-availability-professional-get";
import { availabilityProfessional } from "../../usecase/availability-professional";

export const handler = lambdaApiGatewayWrapper.execute(
  new HttpAvailabilityProfessionalGet(availabilityProfessional)
);
