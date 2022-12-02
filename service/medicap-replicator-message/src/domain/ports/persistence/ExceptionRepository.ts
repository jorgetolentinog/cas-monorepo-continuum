import { Exception } from '../../entity/Exception'

export interface ExceptionRepository {
  create: (exception: Exception) => Promise<void>
  update: (exception: Exception) => Promise<void>
  findById: (exceptionId: string) => Promise<Exception | null>
}
