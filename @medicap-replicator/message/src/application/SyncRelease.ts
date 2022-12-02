import { ReleaseUpdatedEvent } from '@/domain/event/ReleaseUpdatedEvent'
import { EventBus } from '@/domain/ports/EventBus'
import { Metrics } from '@/domain/ports/Metrics'
import { ReleaseRepository } from '@/domain/ports/persistence/ReleaseRepository'
import { inject, injectable } from 'tsyringe'

@injectable()
export class SyncRelease {
  constructor(
    @inject('ReleaseRepository')
    private readonly releaseRepository: ReleaseRepository,

    @inject('EventBus')
    private readonly eventBus: EventBus,

    @inject('Metrics')
    private readonly metrics: Metrics
  ) {}

  async execute(request: SyncReleaseRequest): Promise<void> {
    return await this.metrics.scope(async (metrics) => {
      metrics.putDimensions({ Operation: 'Release' })

      let release = await this.releaseRepository.findById(request.id)

      if (release == null) {
        release = {
          id: request.id,
          date: request.date,
          blockDurationInMinutes: request.blockDurationInMinutes,
          professionalId: request.professionalId,
          companyId: request.companyId,
          officeId: request.officeId,
          serviceId: request.serviceId,
          calendarId: request.calendarId,
          isEnabled: request.isEnabled,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        await this.releaseRepository.create(release)
      } else {
        release.id = request.id
        release.date = request.date
        release.blockDurationInMinutes = request.blockDurationInMinutes
        release.professionalId = request.professionalId
        release.companyId = request.companyId
        release.officeId = request.officeId
        release.serviceId = request.serviceId
        release.calendarId = request.calendarId
        release.isEnabled = request.isEnabled
        release.updatedAt = new Date().toISOString()
        await this.releaseRepository.update(release)
      }

      metrics.putMetric('UpdateCount', 1)
      await this.eventBus.publish(new ReleaseUpdatedEvent(release))
    })
  }
}

export interface SyncReleaseRequest {
  id: string
  date: string
  blockDurationInMinutes: number
  professionalId: string
  companyId: string
  officeId: string
  serviceId: string
  calendarId: string
  isEnabled: boolean
}
