import { Hono, Context } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { showRoutes } from 'hono/dev'

import { sessions as authrMiddleware } from './middleware/session'
import { clients as authrClients } from './middleware/clients'
import { addRoutes } from './routes'
import { getDidDoc } from './routes/.well-known/diddoc'

// const authrRoutes = (app: Hono<{Bindings: CloudflareBindings}>) => {
// }

const authrConfig: any = {
  // setting this to true currently breaks webhook receipt
  required: false,
};

const origins: any = {
  dev: ["https://app.blebbit.org", "https://api.blebbit.org", "https://auth.blebbit.org"],
  stg: ["https://app.authr.blebbit.dev", "https://api.authr.blebbit.dev", "https://auth.authr.blebbit.dev"]
}

const app = new Hono<{Bindings: CloudflareBindings}>()

// want open to public (without cors)
app.get('/.well-known/did.json', getDidDoc)

app.use(logger())

app.use('*', cors({
  origin: (origin: string, c: Context) => {  
    // console.log("CORS.origin:", origin, c.env.AUTHR_ENV, origins[c.env.AUTHR_ENV], origins)
    const validOrigins: string[] = origins[c.env.AUTHR_ENV]
    if (validOrigins.includes(origin)) {
      // console.log("CORS.return:", origin)
      return origin
    }
    // console.log("CORS.return:", "empty")
    return ""
  },
  allowHeaders: ['Content-Type', 'Authorization', 'Cookie', 'atproto-proxy', 'atproto-accept-labelers', 'x-authr-recursive-proxy'],
  allowMethods: ['POST', 'GET', 'OPTIONS'],
  exposeHeaders: ['Content-Length'],
  maxAge: 600,
  credentials: true,
}))

app.use(authrClients())
app.use(authrMiddleware(authrConfig))
// authrRoutes(app)

addRoutes(app)

showRoutes(app)

export default app
