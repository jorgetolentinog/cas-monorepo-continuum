import { metrics } from "@package/metrics";
import { eventbus } from "@package/eventbus";
import { SyncPreBooking } from "./sync-pre-booking";
import { preBookingRepository } from "../../repository";

export const syncBooking = new SyncPreBooking(
  preBookingRepository,
  eventbus,
  metrics
);
