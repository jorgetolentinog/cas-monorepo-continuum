export class ValidationError extends Error {
  innerError?: unknown

  constructor(message = 'Validation Error') {
    super(message)
    this.name = 'ValidationError'
  }

  withInnerError(innerError: unknown) {
    this.innerError = innerError
    return this
  }
}
