import { serve } from '@hono/node-server'
import { Hono, type Context } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { showRoutes } from 'hono/dev'

import sessions from '@/middleware/session'
import routes from '@/routes'

import { migrateToLatest } from '@/db/migrator'
import { tokenRefresher } from '@/jobs/token-refresher';

import config from '@/config'

const origins: any = {
  dev: ["https://app.blebbit.org", "https://api.blebbit.org", "https://auth.blebbit.org"],
  stg: ["https://app.authr.blebbit.dev", "https://api.authr.blebbit.dev", "https://auth.authr.blebbit.dev"]
}

const app = new Hono()

app.use('*', cors({
  origin: (origin: string, c: Context) => {  
    // console.log("CORS.origin:", origin, config.authrEnv, origins[config.authrEnv], origins)
    const validOrigins: string[] = origins[config.authrEnv]
    if (validOrigins.includes(origin)) {
      // console.log("CORS.return:", origin)
      return origin
    }
    // console.log("CORS.return:", "empty")
    return ""
  },
  allowHeaders: ['Content-Type', 'Authorization', 'Cookie', 'atproto-proxy'],
  allowMethods: ['POST', 'GET', 'OPTIONS'],
  exposeHeaders: ['Content-Length'],
  maxAge: 600,
  credentials: true,
}))

app.use(logger())

app.use(sessions)

app.route('/', routes)

showRoutes(app)

migrateToLatest()
  .then(async ()=>{
    // start pgboss process (and probably migrations?)
    await tokenRefresher()
    console.log('token-refresher started')
  })
  .then(()=>{
    serve({
      fetch: app.fetch,
      port: config.port 
    }, (info) => {
      console.log(`Server running on port ${config.port}`);
    })
  })