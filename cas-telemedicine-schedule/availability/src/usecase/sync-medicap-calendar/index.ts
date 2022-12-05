import { SyncMedicapCalendar } from "./sync-medicap-calendar";
import { medicapCalendarRepository } from "../../repository";

export const syncMedicapCalendar = new SyncMedicapCalendar(
  medicapCalendarRepository
);
