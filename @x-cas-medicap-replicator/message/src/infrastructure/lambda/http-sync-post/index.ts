import { container } from '@/infrastructure/injection'
import { ApiGatewayWrapper } from '@package/apigateway-wrapper'
import { Logger } from '@package/logger'
import { Router } from './Router'

export const handler = new ApiGatewayWrapper(
  container.resolve<Logger>('Logger')
).execute(container.resolve(Router))
