import { Router } from 'express';

import { handleXrpc } from '../controllers/xrpc-proxy';

const router = Router();

router.get('/xrpc/:method', handleXrpc)
router.post('/xrpc/:method', handleXrpc)

export default router;