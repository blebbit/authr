import { Hono, Context } from 'hono'

import { handleAuthrWebhook } from './authr'

export function addRoutes(app: Hono) {
  app.post('/webhooks/authr', handleAuthrWebhook)
}

