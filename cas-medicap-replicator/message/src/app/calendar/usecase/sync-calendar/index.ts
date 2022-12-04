import { metrics } from '@package/metrics'
import { eventbus } from '@package/eventbus'
import { SyncCalendar } from './sync-calendar'
import { calendarRepository } from '../../repository'

export const syncCalendar = new SyncCalendar(
  calendarRepository,
  eventbus,
  metrics
)
