import { Hono } from 'hono'

import { addRoutes as postRoutes } from './posts'
import { addRoutes as proxyRoutes } from './proxy'

export function addRoutes(app: Hono) {
  // custom xrpc routes
  // postRoutes(app)

  // should be last as fallback
  proxyRoutes(app)
}