import { metrics } from '@package/metrics'
import { eventbus } from '@package/eventbus'
import { SyncBooking } from './sync-booking'
import { bookingRepository } from '../../repository'

export const syncBooking = new SyncBooking(bookingRepository, eventbus, metrics)
