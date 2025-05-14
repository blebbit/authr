import { Hono, Context } from 'hono'

import { getDidDoc } from './diddoc'

export function addRoutes(app: Hono) {
  app.get('/.well-known/did.json', getDidDoc)
}

