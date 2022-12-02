import { z } from 'zod'
import { injectable } from 'tsyringe'
import { APIGatewayEvent } from 'aws-lambda'
import { ValidationError } from '@/domain/error/ValidationError'
import { ApiGatewayWrapperHandler } from '../wrapper/ApiGatewayWrapper'
import { BookingRoute } from './BookingRoute'
import { PreBookingRoute } from './PreBookingRoute'
import { ReleaseRoute } from './ReleaseRoute'
import { CalendarRoute } from './CalendarRoute'
import { ExceptionRoute } from './ExceptionRoute'

@injectable()
export class Router implements ApiGatewayWrapperHandler {
  constructor(
    private bookingRoute: BookingRoute,
    private preBookingRoute: PreBookingRoute,
    private releaseRoute: ReleaseRoute,
    private calendarRoute: CalendarRoute,
    private exceptionRoute: ExceptionRoute
  ) {}

  async execute(event: APIGatewayEvent) {
    const body = this.bodyParser(event.body ?? '')

    if (!body.success) {
      throw new ValidationError().withInnerError(body.error)
    }

    switch (body.data.type) {
      case 'RSV':
        await this.bookingRoute.execute(event)
        break
      case 'PSV':
        await this.preBookingRoute.execute(event)
        break
      case 'LBR':
        await this.releaseRoute.execute(event)
        break
      case 'CLD':
        await this.calendarRoute.execute(event)
        break
      case 'EXC':
        await this.exceptionRoute.execute(event)
        break
      default:
        throw new ValidationError()
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'OK' })
    }
  }

  private bodyParser(body: string) {
    const schema = z.object({
      type: z.string(),
      data: z.record(z.string(), z.any())
    })

    return schema.safeParse(JSON.parse(body))
  }
}
