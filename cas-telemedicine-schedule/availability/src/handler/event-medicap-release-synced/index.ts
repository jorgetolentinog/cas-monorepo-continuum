import { lambdaEventBridgeWrapper } from "@package/lambda-eventbridge-wrapper";
import { EventMedicapReleaseSynced } from "./event-medicap-release-synced";
import { syncMedicapRelease } from "../../usecase/sync-medicap-release";

export const handler = lambdaEventBridgeWrapper.execute(
  new EventMedicapReleaseSynced(syncMedicapRelease)
);
