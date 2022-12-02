import { SyncMedicapCalendar } from "@/application/sync-medicap-calendar/SyncMedicapCalendar";
import { ValidationError } from "@/domain/errors/ValidationError";
import { EventBridgeEvent } from "aws-lambda";
import { injectable } from "tsyringe";
import { z } from "zod";
import { EventBridgeWrapperHandler } from "../wrapper/EventBridgeWrapper";

@injectable()
export class Handler implements EventBridgeWrapperHandler {
  constructor(private syncMedicapCalendar: SyncMedicapCalendar) {}

  async execute(event: EventBridgeEvent<string, unknown>): Promise<void> {
    const detail = this.detailParser(event.detail);

    if (!detail.success) {
      throw new ValidationError().withInnerError(detail.error);
    }

    await this.syncMedicapCalendar.execute({
      id: detail.data.body.id,
      startDate: detail.data.body.startDate,
      endDate: detail.data.body.endDate,
      isEnabled: detail.data.body.isEnabled,
      companyId: detail.data.body.companyId,
      officeId: detail.data.body.officeId,
      serviceId: detail.data.body.serviceId,
      medicalAreaIds: detail.data.body.medicalAreaIds,
      interestAreaIds: detail.data.body.interestAreaIds,
      professionalId: detail.data.body.professionalId,
      blockDurationInMinutes: detail.data.body.blockDurationInMinutes,
      conditionOfService: detail.data.body.conditionOfService,
      days: detail.data.body.days,
      createdAt: detail.data.body.createdAt,
      updatedAt: detail.data.body.updatedAt,
    });
  }

  private detailParser(detail: unknown) {
    const schema = z.object({
      body: z.object({
        id: z.string(),
        startDate: z.string(),
        endDate: z.string(),
        isEnabled: z.boolean(),
        companyId: z.string(),
        officeId: z.string(),
        serviceId: z.string(),
        medicalAreaIds: z.array(z.string()),
        interestAreaIds: z.array(z.string()),
        professionalId: z.string(),
        blockDurationInMinutes: z.number(),
        conditionOfService: z.object({
          minAge: z.number().optional(),
          maxAge: z.number().optional(),
          gender: z.enum(["F", "M"]).optional(),
        }),
        days: z.array(
          z.object({
            dayOfWeek: z.number(),
            blocks: z.array(
              z.object({
                startTime: z.string(),
                endTime: z.string(),
              })
            ),
          })
        ),
        createdAt: z.string(),
        updatedAt: z.string(),
      }),
    });

    return schema.safeParse(detail);
  }
}
