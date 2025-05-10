import { Hono } from 'hono'

import { cors } from 'hono/cors'
import { logger } from 'hono/logger'

import { showRoutes } from 'hono/dev'

import { addRoutes } from './routes'

const app = new Hono<{Bindings: CloudflareBindings}>()

app.use('*', cors({
  origin: ["https://app.blebbit.org", "https://api.blebbit.org", "https://auth.blebbit.org"],
  // origin: "https://app.authr.blebbit.dev",
  allowHeaders: ['Content-Type', 'Authorization', 'Cookie', 'atproto-proxy'],
  allowMethods: ['POST', 'GET', 'OPTIONS'],
  exposeHeaders: ['Content-Length'],
  maxAge: 600,
  credentials: true,
}))

app.use(logger())

// app.get('/authr-dev-test-route', (c) => c.json(c.env))

addRoutes(app)

showRoutes(app)

export default app
