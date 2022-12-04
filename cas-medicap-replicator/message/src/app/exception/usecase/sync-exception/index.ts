import { metrics } from "@package/metrics";
import { eventbus } from "@package/eventbus";
import { SyncException } from "./sync-exception";
import { exceptionRepository } from "../../repository";

export const syncException = new SyncException(
  exceptionRepository,
  eventbus,
  metrics
);
