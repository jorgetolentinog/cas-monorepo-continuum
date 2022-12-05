import { MedicapCalendar } from "../../entity/medicap-calendar";
import { MedicapCalendarRepository } from "../../repository/medicap-calendar-repository";

export class SyncMedicapCalendar {
  constructor(private medicapCalendarRepository: MedicapCalendarRepository) {}

  async execute(request: MedicapCalendar) {
    const calendar = await this.medicapCalendarRepository.findById(request.id);

    if (calendar == null) {
      await this.medicapCalendarRepository.create({
        id: request.id,
        startDate: request.startDate,
        endDate: request.endDate,
        isEnabled: request.isEnabled,
        companyId: request.companyId,
        officeId: request.officeId,
        serviceId: request.serviceId,
        medicalAreaIds: request.medicalAreaIds,
        interestAreaIds: request.interestAreaIds,
        professionalId: request.professionalId,
        blockDurationInMinutes: request.blockDurationInMinutes,
        conditionOfService: request.conditionOfService,
        days: request.days,
        createdAt: request.createdAt,
        updatedAt: request.updatedAt,
      });
    } else if (request.updatedAt > calendar.updatedAt) {
      await this.medicapCalendarRepository.update({
        id: request.id,
        startDate: request.startDate,
        endDate: request.endDate,
        isEnabled: request.isEnabled,
        companyId: request.companyId,
        officeId: request.officeId,
        serviceId: request.serviceId,
        medicalAreaIds: request.medicalAreaIds,
        interestAreaIds: request.interestAreaIds,
        professionalId: request.professionalId,
        blockDurationInMinutes: request.blockDurationInMinutes,
        conditionOfService: request.conditionOfService,
        days: request.days,
        createdAt: request.createdAt,
        updatedAt: request.updatedAt,
      });
    }
  }
}
