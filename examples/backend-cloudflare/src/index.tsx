import { Hono } from 'hono'

import { cors } from 'hono/cors'
import { logger } from 'hono/logger'

import { showRoutes } from 'hono/dev'

import { addRoutes } from './routes'

type Bindings = {
	DB: D1Database;
}

const app = new Hono<{Bindings: Bindings}>()

app.use(cors({
  origin: ["https://app.blebbit.org", "https://api.blebbit.org", "https://auth.blebbit.org"],
  allowHeaders: ['Content-Type', 'Authorization', 'atproto-proxy'],
  allowMethods: ['POST', 'GET', 'OPTIONS'],
  exposeHeaders: ['Content-Length'],
  maxAge: 600,
  credentials: true,
}))
app.use(logger())

addRoutes(app)

showRoutes(app)

export default app
