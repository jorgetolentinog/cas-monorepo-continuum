import { v4 as uuidv4 } from 'uuid'
import { Exception } from '../entity/Exception'
import { EventBusMessage } from '@package/eventbus/EventBus'

export class ExceptionUpdatedEvent implements EventBusMessage {
  eventId: string
  eventType: string
  timestamp: string
  body: Record<string, unknown>

  constructor(exception: Exception) {
    this.eventId = uuidv4()
    this.eventType = 'exception.updated'
    this.timestamp = new Date().toISOString()
    this.body = { ...exception }
  }
}
