import { BookingRepository } from "../../repository/booking-repository";
import { Metrics } from "@package/metrics/metrics";
import { EventBus } from "@package/eventbus/EventBus";
import { BookingUpdatedEvent } from "../../event/booking-updated-event";

export class SyncBooking {
  constructor(
    private readonly bookingRepository: BookingRepository,
    private readonly eventBus: EventBus,
    private readonly metrics: Metrics
  ) {}

  async execute(request: SyncBookingRequest): Promise<void> {
    return await this.metrics.scope(async (metrics) => {
      metrics.putDimensions({ Operation: "Booking" });

      let booking = await this.bookingRepository.findById(request.id);

      if (booking == null) {
        booking = {
          id: request.id,
          date: request.date,
          companyId: request.companyId,
          officeId: request.officeId,
          serviceId: request.serviceId,
          professionalId: request.professionalId,
          patientId: request.patientId,
          calendarId: request.calendarId,
          blockDurationInMinutes: request.blockDurationInMinutes,
          isEnabled: request.isEnabled,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        await this.bookingRepository.create(booking);
      } else {
        booking.date = request.date;
        booking.companyId = request.companyId;
        booking.officeId = request.officeId;
        booking.serviceId = request.serviceId;
        booking.professionalId = request.professionalId;
        booking.patientId = request.patientId;
        booking.calendarId = request.calendarId;
        booking.blockDurationInMinutes = request.blockDurationInMinutes;
        booking.isEnabled = request.isEnabled;
        booking.updatedAt = new Date().toISOString();
        await this.bookingRepository.update(booking);
      }

      metrics.putMetric("UpdateCount", 1);
      await this.eventBus.publish(new BookingUpdatedEvent(booking));
    });
  }
}

export interface SyncBookingRequest {
  id: string;
  companyId: string;
  officeId: string;
  serviceId: string;
  professionalId: string;
  calendarId: string;
  patientId: string;
  date: string;
  blockDurationInMinutes: number;
  isEnabled: boolean;
}
