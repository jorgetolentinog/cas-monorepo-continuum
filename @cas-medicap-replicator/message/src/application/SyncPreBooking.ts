import { PreBookingUpdatedEvent } from '@/domain/event/PreBookingUpdatedEvent'
import { EventBus } from '@/domain/ports/EventBus'
import { Metrics } from '@/domain/ports/Metrics'
import { PreBookingRepository } from '@/domain/ports/persistence/PreBookingRepository'
import { inject, injectable } from 'tsyringe'

@injectable()
export class SyncPreBooking {
  constructor(
    @inject('PreBookingRepository')
    private readonly preBookingRepository: PreBookingRepository,

    @inject('EventBus')
    private readonly eventBus: EventBus,

    @inject('Metrics')
    private readonly metrics: Metrics
  ) {}

  async execute(request: SyncPreBookingRequest): Promise<void> {
    return await this.metrics.scope(async (metrics) => {
      metrics.putDimensions({ Operation: 'PreBooking' })

      let preBooking = await this.preBookingRepository.findById(request.id)

      if (preBooking == null) {
        preBooking = {
          id: request.id,
          date: request.date,
          companyId: request.companyId,
          officeId: request.officeId,
          serviceId: request.serviceId,
          professionalId: request.professionalId,
          calendarId: request.calendarId,
          blockDurationInMinutes: request.blockDurationInMinutes,
          isEnabled: request.isEnabled,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        await this.preBookingRepository.create(preBooking)
      } else {
        preBooking.date = request.date
        preBooking.companyId = request.companyId
        preBooking.officeId = request.officeId
        preBooking.serviceId = request.serviceId
        preBooking.professionalId = request.professionalId
        preBooking.calendarId = request.calendarId
        preBooking.blockDurationInMinutes = request.blockDurationInMinutes
        preBooking.isEnabled = request.isEnabled
        preBooking.updatedAt = new Date().toISOString()
        await this.preBookingRepository.update(preBooking)
      }

      metrics.putMetric('UpdateCount', 1)
      await this.eventBus.publish(new PreBookingUpdatedEvent(preBooking))
    })
  }
}

export interface SyncPreBookingRequest {
  id: string
  companyId: string
  officeId: string
  serviceId: string
  professionalId: string
  calendarId: string
  date: string
  blockDurationInMinutes: number
  isEnabled: boolean
}
