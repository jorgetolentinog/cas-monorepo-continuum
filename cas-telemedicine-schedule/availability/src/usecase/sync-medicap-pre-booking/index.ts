import { SyncMedicapPreBooking } from "./sync-medicap-pre-booking";
import { medicapPreBookingRepository } from "../../repository";

export const syncMedicapPreBooking = new SyncMedicapPreBooking(
  medicapPreBookingRepository
);
