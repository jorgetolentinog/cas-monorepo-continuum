import fastSafeStringify from 'fast-safe-stringify'
import { Logger } from '@/domain/ports/Logger'

export class StructuredLogger implements Logger {
  log(message: string, data: Record<string, unknown>): void {
    console.log(
      this.safeStringify({
        timestamp: new Date().toISOString(),
        message,
        data
      })
    )
  }

  private safeStringify(object?: unknown): string {
    return fastSafeStringify(object, (key: string, value: unknown) => {
      if (value instanceof Error) {
        const error: Record<string, unknown> = {}
        Object.getOwnPropertyNames(value).forEach((propName) => {
          error[propName] = (value as unknown as Record<string, unknown>)[
            propName
          ]
        })
        return error
      }
      return value
    })
  }
}
