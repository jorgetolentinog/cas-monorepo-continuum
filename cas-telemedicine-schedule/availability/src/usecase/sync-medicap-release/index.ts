import { SyncMedicapRelease } from "./sync-medicap-release";
import { medicapReleaseRepository } from "../../repository";

export const syncMedicapRelease = new SyncMedicapRelease(
  medicapReleaseRepository
);
