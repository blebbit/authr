import { Router } from 'express';

import {
  // getPermission,
  getPermissions,
  // createPermission,
  // updatePermission,
  // deletePermission,
} from '../controllers/posts';

// this router should be broken out into an example extension of Authr
//   or an example of where ever your @blebbit/xrpc-proxy / project is running

const router = Router();

// queries
// router.get('/xrpc/app.blebbit.authr.getPermission', getPermission);
router.get('/xrpc/app.blebbit.authr.getPermissions', getPermissions);

// procedures
// router.post('/xrpc/app.blebbit.authr.createPermission', createPermission);
// router.post('/xrpc/app.blebbit.authr.updatePermission', updatePermission);
// router.post('/xrpc/app.blebbit.authr.deletePermission', deletePermission);

// eventually granting permissions to other users

export default router;