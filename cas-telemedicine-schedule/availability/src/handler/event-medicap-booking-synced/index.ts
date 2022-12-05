import { lambdaEventBridgeWrapper } from "@package/lambda-eventbridge-wrapper";
import { EventMedicapBookingSynced } from "./event-medicap-booking-synced";
import { syncMedicapBooking } from "../../usecase/sync-medicap-booking";

export const handler = lambdaEventBridgeWrapper.execute(
  new EventMedicapBookingSynced(syncMedicapBooking)
);
