import { Metrics } from "@package/metrics/metrics";
import { EventBus } from "@package/eventbus/eventbus";
import { CalendarUpdatedEvent } from "../../event/calendar-updated-event";
import { CalendarRepository } from "../../repository/calendar-repository";

export class SyncCalendar {
  constructor(
    private readonly calendarRepository: CalendarRepository,
    private readonly eventBus: EventBus,
    private readonly metrics: Metrics
  ) {}

  async execute(request: SyncCalendarRequest): Promise<void> {
    return await this.metrics.scope(async (metrics) => {
      metrics.putDimensions({ Operation: "Calendar" });

      let calendar = await this.calendarRepository.findById(request.id);

      if (calendar == null) {
        calendar = {
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
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        await this.calendarRepository.create(calendar);
      } else {
        calendar.startDate = request.startDate;
        calendar.endDate = request.endDate;
        calendar.isEnabled = request.isEnabled;
        calendar.companyId = request.companyId;
        calendar.officeId = request.officeId;
        calendar.serviceId = request.serviceId;
        calendar.medicalAreaIds = request.medicalAreaIds;
        calendar.interestAreaIds = request.interestAreaIds;
        calendar.professionalId = request.professionalId;
        calendar.blockDurationInMinutes = request.blockDurationInMinutes;
        calendar.conditionOfService = request.conditionOfService;
        calendar.days = request.days;
        calendar.updatedAt = new Date().toISOString();
        await this.calendarRepository.update(calendar);
      }

      metrics.putMetric("UpdateCount", 1);
      await this.eventBus.publish(new CalendarUpdatedEvent(calendar));
    });
  }
}

export interface SyncCalendarRequest {
  id: string;
  startDate: string;
  endDate: string;
  isEnabled: boolean;
  companyId: string;
  officeId: string;
  serviceId: string;
  medicalAreaIds: string[];
  interestAreaIds: string[];
  professionalId: string;
  blockDurationInMinutes: number;
  conditionOfService: {
    minAge?: {
      year: number;
      month: number;
    };
    maxAge?: {
      year: number;
      month: number;
    };
    gender?: "F" | "M";
  };
  days: Array<{
    dayOfWeek: number;
    blocks: Array<{
      startTime: string;
      endTime: string;
    }>;
  }>;
}
