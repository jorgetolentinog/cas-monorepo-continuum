import { MedicapRelease } from "@/domain/entities/MedicapRelease";
import { MedicapReleaseRepository } from "@/domain/ports/persistence/MedicapReleaseRepository";
import { inject, injectable } from "tsyringe";

@injectable()
export class SyncMedicapRelease {
  constructor(
    @inject("MedicapReleaseRepository")
    private medicapReleaseRepository: MedicapReleaseRepository
  ) {}

  async execute(request: SyncMedicapReleaseRequest) {
    const release = await this.medicapReleaseRepository.findById(request.id);

    if (release == null) {
      await this.medicapReleaseRepository.create({
        id: request.id,
        date: request.date,
        blockDurationInMinutes: request.blockDurationInMinutes,
        professionalId: request.professionalId,
        serviceId: request.serviceId,
        isEnabled: request.isEnabled,
        createdAt: request.createdAt,
        updatedAt: request.updatedAt,
      });
    } else if (request.updatedAt > release.updatedAt) {
      await this.medicapReleaseRepository.update({
        id: request.id,
        date: request.date,
        blockDurationInMinutes: request.blockDurationInMinutes,
        professionalId: request.professionalId,
        serviceId: request.serviceId,
        isEnabled: request.isEnabled,
        createdAt: request.createdAt,
        updatedAt: request.updatedAt,
      });
    }
  }
}

export type SyncMedicapReleaseRequest = MedicapRelease;
