import { SyncMedicapBooking } from "@/application/sync-medicap-booking/SyncMedicapBooking";
import { ValidationError } from "@/domain/errors/ValidationError";
import { EventBridgeEvent } from "aws-lambda";
import { injectable } from "tsyringe";
import { z } from "zod";
import { EventBridgeWrapperHandler } from "../wrapper/EventBridgeWrapper";

@injectable()
export class Handler implements EventBridgeWrapperHandler {
  constructor(private syncMedicapBooking: SyncMedicapBooking) {}

  async execute(event: EventBridgeEvent<string, unknown>): Promise<void> {
    const detail = this.detailParser(event.detail);

    if (!detail.success) {
      throw new ValidationError().withInnerError(detail.error);
    }

    await this.syncMedicapBooking.execute({
      id: detail.data.body.id,
      date: detail.data.body.date,
      companyId: detail.data.body.companyId,
      officeId: detail.data.body.officeId,
      serviceId: detail.data.body.serviceId,
      professionalId: detail.data.body.professionalId,
      patientId: detail.data.body.patientId,
      calendarId: detail.data.body.calendarId,
      blockDurationInMinutes: detail.data.body.blockDurationInMinutes,
      isEnabled: detail.data.body.isEnabled,
      createdAt: detail.data.body.createdAt,
      updatedAt: detail.data.body.updatedAt,
    });
  }

  private detailParser(detail: unknown) {
    const schema = z.object({
      body: z.object({
        id: z.string(),
        date: z.string(),
        companyId: z.string(),
        officeId: z.string(),
        serviceId: z.string(),
        professionalId: z.string(),
        patientId: z.string(),
        calendarId: z.string(),
        blockDurationInMinutes: z.number(),
        isEnabled: z.boolean(),
        createdAt: z.string(),
        updatedAt: z.string(),
      }),
    });

    return schema.safeParse(detail);
  }
}
