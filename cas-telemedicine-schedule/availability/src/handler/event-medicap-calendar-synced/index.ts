import { lambdaEventBridgeWrapper } from "@package/lambda-eventbridge-wrapper";
import { EventMedicapCalendarSynced } from "./event-medicap-calendar-synced";
import { syncMedicapCalendar } from "../../usecase/sync-medicap-calendar";

export const handler = lambdaEventBridgeWrapper.execute(
  new EventMedicapCalendarSynced(syncMedicapCalendar)
);
