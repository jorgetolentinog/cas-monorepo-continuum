import { Logger } from './logger'

export class SimpleLogger implements Logger {
  log(message: string, data: Record<string, unknown>): void {
    console.log(message, data)
  }
}
