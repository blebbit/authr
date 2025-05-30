import { Hono } from 'hono'
import {
  clientMetadata,
  jwks,
  login,
  callback,
  refresh,
  info,
} from '@/controllers/oauth';

const router = new Hono();

router.get('/client-metadata.json', clientMetadata);
router.get('/jwks.json', jwks);

router.post('/login', login)
router.get('/callback', callback)
router.post('/refresh', refresh)
router.get('/info', info)

// refresh
// session (get, delete)

export default router;
