import { Router } from 'express';
import {
  callback,
  clientMetadata,
  jwks,
  login,
} from '../controllers/oauth';

const router = Router();

router.get('/client-metadata.json', clientMetadata);
router.get('/jwks.json', jwks);

router.post('/login', login)
router.get('/callback', callback)

// refresh
// session (get, delete)

export default router;
