import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda'
import { inject, injectable } from 'tsyringe'
import { ValidationError } from '@package/error'
import { Logger } from '@/domain/ports/Logger'

@injectable()
export class ApiGatewayWrapper {
  constructor(@inject('Logger') private logger: Logger) {}

  execute(handler: ApiGatewayWrapperHandler) {
    return async (
      event: APIGatewayEvent,
      context: Context
    ): Promise<APIGatewayProxyResult> => {
      let result: APIGatewayProxyResult

      try {
        this.logger.log('ApiGatewayWrapper event', { event })
        result = await handler.execute(event, context)
      } catch (error) {
        this.logger.log('ApiGatewayWrapper error', { error })

        let status = 500
        let message = 'Server Error'
        if (error instanceof ValidationError) {
          status = 400
          message = error.message
        }

        result = {
          statusCode: status,
          body: JSON.stringify({ message, timestamp: new Date().toISOString() })
        }
      }

      return {
        ...result,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
          ...result.headers
        }
      }
    }
  }
}

export interface ApiGatewayWrapperHandler {
  execute(
    event: APIGatewayEvent,
    context: Context
  ): Promise<APIGatewayProxyResult>
}
