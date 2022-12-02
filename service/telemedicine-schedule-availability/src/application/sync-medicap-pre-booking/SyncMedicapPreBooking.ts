import { MedicapPreBooking } from "@/domain/entities/MedicapPreBooking";
import { MedicapPreBookingRepository } from "@/domain/ports/persistence/MedicapPreBookingRepository";
import { inject, injectable } from "tsyringe";

@injectable()
export class SyncMedicapPreBooking {
  constructor(
    @inject("MedicapPreBookingRepository")
    private medicapPreBookingRepository: MedicapPreBookingRepository
  ) {}

  async execute(request: SyncMedicapPreBookingRequest) {
    const preBooking = await this.medicapPreBookingRepository.findById(
      request.id
    );

    if (preBooking == null) {
      await this.medicapPreBookingRepository.create({
        id: request.id,
        date: request.date,
        companyId: request.companyId,
        officeId: request.officeId,
        serviceId: request.serviceId,
        professionalId: request.professionalId,
        calendarId: request.calendarId,
        blockDurationInMinutes: request.blockDurationInMinutes,
        isEnabled: request.isEnabled,
        createdAt: request.createdAt,
        updatedAt: request.updatedAt,
      });
    } else if (request.updatedAt > preBooking.updatedAt) {
      await this.medicapPreBookingRepository.update({
        id: request.id,
        date: request.date,
        companyId: request.companyId,
        officeId: request.officeId,
        serviceId: request.serviceId,
        professionalId: request.professionalId,
        calendarId: request.calendarId,
        blockDurationInMinutes: request.blockDurationInMinutes,
        isEnabled: request.isEnabled,
        createdAt: request.createdAt,
        updatedAt: request.updatedAt,
      });
    }
  }
}

export type SyncMedicapPreBookingRequest = MedicapPreBooking;
