export interface Logger {
  log(message: string, data: Record<string, unknown>): void
}
