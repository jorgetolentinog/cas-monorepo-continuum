import { v4 as uuidv4 } from 'uuid'
import { Release } from '../entity/Release'
import { EventBusMessage } from "@package/eventbus/EventBus";

export class ReleaseUpdatedEvent implements EventBusMessage {
  eventId: string
  eventType: string
  timestamp: string
  body: Record<string, unknown>

  constructor(release: Release) {
    this.eventId = uuidv4()
    this.eventType = 'release.updated'
    this.timestamp = new Date().toISOString()
    this.body = { ...release }
  }
}
