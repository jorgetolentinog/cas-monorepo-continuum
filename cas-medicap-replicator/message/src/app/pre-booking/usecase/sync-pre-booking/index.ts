import { metrics } from "@package/metrics";
import { eventbus } from "@package/eventbus";
import { SyncPreBooking } from "./sync-pre-booking";
import { preBookingRepository } from "../../repository";

export const syncPreBooking = new SyncPreBooking(
  preBookingRepository,
  eventbus,
  metrics
);
