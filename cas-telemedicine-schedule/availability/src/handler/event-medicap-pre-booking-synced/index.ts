import { lambdaEventBridgeWrapper } from "@package/lambda-eventbridge-wrapper";
import { EventMedicapPreBookingSynced } from "./event-medicap-pre-booking-synced";
import { syncMedicapPreBooking } from "../../usecase/sync-medicap-pre-booking";

export const handler = lambdaEventBridgeWrapper.execute(
  new EventMedicapPreBookingSynced(syncMedicapPreBooking)
);
