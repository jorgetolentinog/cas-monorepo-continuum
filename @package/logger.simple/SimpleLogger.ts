import type { Logger } from '@package/logger'

export class SimpleLogger implements Logger {
  log(message: string, data: Record<string, unknown>): void {
    console.log(message, data)
  }
}
