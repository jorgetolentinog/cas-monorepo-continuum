import { EventBus } from '@/domain/ports/EventBus'
import { injectable } from 'tsyringe'

@injectable()
export class MockEventBus implements EventBus {
  async publish(): Promise<void> {
    // do nothing
  }
}
