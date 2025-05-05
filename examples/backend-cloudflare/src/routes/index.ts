import { Hono, Context } from 'hono'

import { addRoutes as webooksRoutes } from './webhooks'
import { addRoutes as xrpcRoutes } from './xrpc'

export function addRoutes(app: Hono) {
  app.get('/', hello)

  webooksRoutes(app)
  xrpcRoutes(app)
}

function hello(c: Context) {
  return c.json({
    message: 'Hello from Authr!',
  })
}