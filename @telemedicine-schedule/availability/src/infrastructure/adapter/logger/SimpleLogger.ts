import { Logger } from '@/domain/ports/Logger'

export class SimpleLogger implements Logger {
  log(message: string, data: Record<string, unknown>): void {
    console.log(message, data)
  }
}
