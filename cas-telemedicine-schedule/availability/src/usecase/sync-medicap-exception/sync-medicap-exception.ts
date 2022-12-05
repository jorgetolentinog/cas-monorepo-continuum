import { MedicapException } from "../../entity/medicap-exception";
import { MedicapExceptionRepository } from "../../repository/medicap-exception-repository";

export class SyncMedicapException {
  constructor(private medicapExceptionRepository: MedicapExceptionRepository) {}

  async execute(request: MedicapException) {
    const exception = await this.medicapExceptionRepository.findById(
      request.id
    );

    if (exception == null) {
      await this.medicapExceptionRepository.create({
        id: request.id,
        startDate: request.startDate,
        endDate: request.endDate,
        isEnabled: request.isEnabled,
        recurrence: request.recurrence,
        repeatRecurrenceEvery: request.repeatRecurrenceEvery,
        professionalIds: request.professionalIds,
        serviceIds: request.serviceIds,
        dayOfMonth: request.dayOfMonth,
        weekOfMonth: request.weekOfMonth,
        dayOfWeek: request.dayOfWeek,
        days: request.days,
        createdAt: request.createdAt,
        updatedAt: request.updatedAt,
      });
    } else if (request.updatedAt > exception.updatedAt) {
      await this.medicapExceptionRepository.update({
        id: request.id,
        startDate: request.startDate,
        endDate: request.endDate,
        isEnabled: request.isEnabled,
        recurrence: request.recurrence,
        repeatRecurrenceEvery: request.repeatRecurrenceEvery,
        professionalIds: request.professionalIds,
        serviceIds: request.serviceIds,
        dayOfMonth: request.dayOfMonth,
        weekOfMonth: request.weekOfMonth,
        dayOfWeek: request.dayOfWeek,
        days: request.days,
        createdAt: request.createdAt,
        updatedAt: request.updatedAt,
      });
    }
  }
}
