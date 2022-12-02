import { MedicapException } from "@/domain/entities/MedicapException";
import { MedicapExceptionRepository } from "@/domain/ports/persistence/MedicapExceptionRepository";
import { inject, injectable } from "tsyringe";

@injectable()
export class SyncMedicapException {
  constructor(
    @inject("MedicapExceptionRepository")
    private medicapExceptionRepository: MedicapExceptionRepository
  ) {}

  async execute(request: SyncMedicapExceptionRequest) {
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

export type SyncMedicapExceptionRequest = MedicapException;
