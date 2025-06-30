import { Hono, Context } from 'hono'

import { addRoutes as webhooksRoutes } from './webhooks'
import { addRoutes as proxyRoutes } from './xrpc/proxy'

import { xrpcRouter } from 'authr-example-flexicon/server-ts'

export function addRoutes(app: Hono) {
  app.get('/', hello)

  webhooksRoutes(app)

  // XRPC routes
  // 1. app routes
  // 2. wildcard to proxy unknown
  app.route('/', xrpcRouter)
  proxyRoutes(app)
}

function hello(c: Context) {
  return c.json({
    message: 'Hello from Authr Example Backend!',
  })
}