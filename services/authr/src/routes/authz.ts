import { Hono } from 'hono';

import {
  getSchema,
  putSchema,
  createRelationship,
  checkPermission,
  checkBulkPermissions,
  // getPermission,
  // createPermission,
  // updatePermission,
  // deletePermission,
} from '@/controllers/authz';

const router = new Hono();

// schema
router.get('/schema', getSchema);
router.post('/schema', putSchema);
router.post('/relationship', createRelationship);
router.post('/check', checkPermission);
router.post('/check-bulk', checkBulkPermissions);

// permissions

export default router;