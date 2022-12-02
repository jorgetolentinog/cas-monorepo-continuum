import { MedicapRelease } from "../../entities/MedicapRelease";

export interface MedicapReleaseRepository {
  create: (release: MedicapRelease) => Promise<void>;
  update: (release: MedicapRelease) => Promise<void>;
  findById: (releaseId: string) => Promise<MedicapRelease | null>;
}
