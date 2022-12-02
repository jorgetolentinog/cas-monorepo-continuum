import { container } from '@/infrastructure/injection'
import { ApiGatewayWrapper } from '../wrapper/ApiGatewayWrapper'
import { Router } from './Router'

export const handler = container
  .resolve(ApiGatewayWrapper)
  .execute(container.resolve(Router))
