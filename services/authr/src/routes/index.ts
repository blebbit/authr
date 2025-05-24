import { Hono, type Context } from 'hono'

import oauthRoutes from './oauth'
import authzRoutes from './authz'
import xrpcRoutes from './xrpc'

const router = new Hono()

router.get('/', (c: Context) => {
  return c.json({
    message: 'Hello from Authr!',
  })
})

router.route('/oauth', oauthRoutes)
router.route('/authz', authzRoutes)
router.route('/xrpc', xrpcRoutes)

export default router;