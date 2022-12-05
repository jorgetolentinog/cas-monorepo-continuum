import { MedicapRelease } from "../entity/medicap-release";

export interface MedicapReleaseRepository {
  create: (release: MedicapRelease) => Promise<void>;
  update: (release: MedicapRelease) => Promise<void>;
  findById: (releaseId: string) => Promise<MedicapRelease | null>;
}
