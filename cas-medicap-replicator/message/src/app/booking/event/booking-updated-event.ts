import { Booking } from '../entity/Booking'
import { EventBusMessage } from '@package/eventbus/EventBus'
import { v4 as uuidv4 } from 'uuid'

export class BookingUpdatedEvent implements EventBusMessage {
  eventId: string
  eventType: string
  timestamp: string
  body: Record<string, unknown>

  constructor(booking: Booking) {
    this.eventId = uuidv4()
    this.eventType = 'booking.updated'
    this.timestamp = new Date().toISOString()
    this.body = { ...booking }
  }
}
