import { v4 as uuidv4 } from 'uuid'
import { PreBooking } from '../entity/pre-booking'
import { EventBusMessage } from '@package/eventbus/EventBus'

export class PreBookingUpdatedEvent implements EventBusMessage {
  eventId: string
  eventType: string
  timestamp: string
  body: Record<string, unknown>

  constructor(preBooking: PreBooking) {
    this.eventId = uuidv4()
    this.eventType = 'pre-booking.updated'
    this.timestamp = new Date().toISOString()
    this.body = { ...preBooking }
  }
}
