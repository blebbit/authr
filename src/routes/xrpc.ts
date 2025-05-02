import { Router } from 'express';

import { handleXrpc } from '../controllers/xrpc-proxy';

const router = Router();

router.get('/xrpc/:account/:collection/:rkey', handleXrpc)
router.post('/xrpc/:account/:collection/:rkey', handleXrpc)

export default router;