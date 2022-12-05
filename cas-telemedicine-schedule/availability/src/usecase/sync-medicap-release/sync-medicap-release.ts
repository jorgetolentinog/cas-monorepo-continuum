import { MedicapRelease } from "../../entity/medicap-release";
import { MedicapReleaseRepository } from "../../repository/medicap-release-repository";

export class SyncMedicapRelease {
  constructor(private medicapReleaseRepository: MedicapReleaseRepository) {}

  async execute(request: MedicapRelease) {
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
