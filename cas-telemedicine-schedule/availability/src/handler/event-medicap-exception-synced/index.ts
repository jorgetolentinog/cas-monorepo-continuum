import { lambdaEventBridgeWrapper } from "@package/lambda-eventbridge-wrapper";
import { EventMedicapExceptionSynced } from "./event-medicap-exception-synced";
import { syncMedicapException } from "../../usecase/sync-medicap-exception";

export const handler = lambdaEventBridgeWrapper.execute(
  new EventMedicapExceptionSynced(syncMedicapException)
);
