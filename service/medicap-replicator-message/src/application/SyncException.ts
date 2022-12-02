import { ExceptionUpdatedEvent } from '@/domain/event/ExceptionUpdatedEvent'
import { EventBus } from '@/domain/ports/EventBus'
import { Metrics } from '@/domain/ports/Metrics'
import { ExceptionRepository } from '@/domain/ports/persistence/ExceptionRepository'
import { inject, injectable } from 'tsyringe'

@injectable()
export class SyncException {
  constructor(
    @inject('ExceptionRepository')
    private readonly exceptionRepository: ExceptionRepository,

    @inject('EventBus')
    private readonly eventBus: EventBus,

    @inject('Metrics')
    private readonly metrics: Metrics
  ) {}

  async execute(request: SyncExceptionRequest): Promise<void> {
    return await this.metrics.scope(async (metrics) => {
      metrics.putDimensions({ Operation: 'Exception' })

      let exception = await this.exceptionRepository.findById(request.id)

      if (exception == null) {
        exception = {
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
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        await this.exceptionRepository.create(exception)
      } else {
        exception.startDate = request.startDate
        exception.endDate = request.endDate
        exception.isEnabled = request.isEnabled
        exception.recurrence = request.recurrence
        exception.repeatRecurrenceEvery = request.repeatRecurrenceEvery
        exception.professionalIds = request.professionalIds
        exception.serviceIds = request.serviceIds
        exception.dayOfMonth = request.dayOfMonth
        exception.weekOfMonth = request.weekOfMonth
        exception.dayOfWeek = request.dayOfWeek
        exception.days = request.days
        exception.updatedAt = new Date().toISOString()
        await this.exceptionRepository.update(exception)
      }

      metrics.putMetric('UpdateCount', 1)
      await this.eventBus.publish(new ExceptionUpdatedEvent(exception))
    })
  }
}

export interface SyncExceptionRequest {
  id: string
  startDate: string
  endDate: string
  isEnabled: boolean
  recurrence: 'weekly' | 'monthly'
  repeatRecurrenceEvery: number
  professionalIds: string[]
  serviceIds: string[]
  dayOfMonth?: number
  weekOfMonth?: number
  dayOfWeek?: number
  days: Array<{
    dayOfWeek?: number
    blocks: Array<{
      startTime: string
      endTime: string
    }>
  }>
}
