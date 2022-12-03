import { container } from 'tsyringe'
import { BookingRepository } from '@/domain/ports/persistence/BookingRepository'
import { PreBookingRepository } from '@/domain/ports/persistence/PreBookingRepository'
import { ReleaseRepository } from '@/domain/ports/persistence/ReleaseRepository'
import { CalendarRepository } from '@/domain/ports/persistence/CalendarRepository'
import { ExceptionRepository } from '@/domain/ports/persistence/ExceptionRepository'
import { EventBus } from '@/domain/ports/EventBus'
import { DynamoDBBookingRepository } from '@/infrastructure/adapter/persistence/DynamoDBBookingRepository'
import { DynamoDBPreBookingRepository } from '@/infrastructure/adapter/persistence/DynamoDBPreBookingRepository'
import { DynamoDBReleaseRepository } from '@/infrastructure/adapter/persistence/DynamoDBReleaseRepository'
import { DynamoDBCalendarRepository } from '@/infrastructure/adapter/persistence/DynamoDBCalendarRepository'
import { DynamoDBExceptionRepository } from '@/infrastructure/adapter/persistence/DynamoDBExceptionRepository'
import { MockEventBus } from '@/infrastructure/adapter/eventbus/MockEventBus'
import { EventBridgeEventBus } from '../adapter/eventbus/EventBridgeEventBus'
import { Metrics } from '@/domain/ports/Metrics'
import { MockMetrics } from '../adapter/metrics/MockMetrics'
import { AwsMetrics } from '../adapter/metrics/AwsMetrics'

import { Logger } from '@package/logger'
import { SimpleLogger } from '@package/logger.simple'
import { StructuredLogger } from '@package/logger.structured'

container.register<BookingRepository>(
  'BookingRepository',
  DynamoDBBookingRepository
)

container.register<PreBookingRepository>(
  'PreBookingRepository',
  DynamoDBPreBookingRepository
)

container.register<ReleaseRepository>(
  'ReleaseRepository',
  DynamoDBReleaseRepository
)

container.register<CalendarRepository>(
  'CalendarRepository',
  DynamoDBCalendarRepository
)

container.register<ExceptionRepository>(
  'ExceptionRepository',
  DynamoDBExceptionRepository
)

if (process.env.IS_OFFLINE) {
  container.register<EventBus>('EventBus', MockEventBus)
  container.register<Logger>('Logger', SimpleLogger)
  container.register<Metrics>('Metrics', MockMetrics)
} else {
  container.register<EventBus>('EventBus', EventBridgeEventBus)
  container.register<Logger>('Logger', StructuredLogger)
  container.register<Metrics>('Metrics', AwsMetrics)
}

export { container }
