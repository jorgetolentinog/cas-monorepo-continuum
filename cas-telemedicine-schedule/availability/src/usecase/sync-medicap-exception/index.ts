import { SyncMedicapException } from "./sync-medicap-exception";
import { medicapExceptionRepository } from "../../repository";

export const syncMedicapException = new SyncMedicapException(
  medicapExceptionRepository
);
