import { SyncMedicapBooking } from "./sync-medicap-booking";
import { medicapBookingRepository } from "../../repository";

export const syncMedicapBooking = new SyncMedicapBooking(
  medicapBookingRepository
);
