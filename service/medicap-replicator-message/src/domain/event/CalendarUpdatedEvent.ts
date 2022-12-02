import { v4 as uuidv4 } from 'uuid'
import { Calendar } from '../entity/Calendar'
import { EventBusMessage } from '../ports/EventBus'

export class CalendarUpdatedEvent implements EventBusMessage {
  eventId: string
  eventType: string
  timestamp: string
  body: Record<string, unknown>

  constructor(calendar: Calendar) {
    this.eventId = uuidv4()
    this.eventType = 'calendar.updated'
    this.timestamp = new Date().toISOString()
    this.body = { ...calendar }
  }
}
