import { Hono } from 'hono'

import { handleXrpc } from '../controllers/xrpc-proxy';

const router = new Hono();

router.get('/:method', handleXrpc)
router.post('/:method', handleXrpc)

export default router;