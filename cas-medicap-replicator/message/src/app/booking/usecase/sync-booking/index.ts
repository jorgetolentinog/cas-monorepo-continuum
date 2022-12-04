import { SyncBooking } from "./sync-booking";
import { bookingRepository } from "../../repository";
import { metrics } from "@package/metrics";

export const syncBooking = new SyncBooking(bookingRepository, metrics);
