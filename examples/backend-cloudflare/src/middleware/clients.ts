import { Context, Next } from 'hono'

import { getConfig } from '../config'
import { getAuthzClient } from 'authr-example-flexicon/lib/authz'

// Client setup
export const clients = () => {

  const middleware = async (c: Context, next: Next) => {
    const config = getConfig(c.env)
    const client = getAuthzClient(config.authz)

    c.set("authzClient", client)

    await next()
  }

  return middleware
}