import { z } from 'zod'
import { APIGatewayEvent } from 'aws-lambda'
import { ValidationError } from '@package/error'
import { LambdaApiGatewayWrapperHandler } from '@package/lambda-apigateway-wrapper/wrapper'
import { BookingRoute } from './booking-route'
import { PreBookingRoute } from './pre-booking-route'
import { ReleaseRoute } from './release-route'
import { CalendarRoute } from './calendar-route'
import { ExceptionRoute } from './exception-route'

export class Router implements LambdaApiGatewayWrapperHandler {
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
