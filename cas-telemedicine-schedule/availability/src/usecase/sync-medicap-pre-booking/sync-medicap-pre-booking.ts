import { MedicapPreBooking } from "../../entity/medicap-pre-booking";
import { MedicapPreBookingRepository } from "../../repository/medicap-pre-booking-repository";

export class SyncMedicapPreBooking {
  constructor(
    private medicapPreBookingRepository: MedicapPreBookingRepository
  ) {}

  async execute(request: MedicapPreBooking) {
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
