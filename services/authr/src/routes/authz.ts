import { Hono } from 'hono';

import {
  handleGetSchema,
  handlePutSchema,
  handleGetRelationship,
  handleCreateRelationship,
  handleCheckPermission,
  handleCheckBulkPermissions,
  handleLookupResources,
  handleLookupSubjects,
} from '@/controllers/authz';

const router = new Hono();

// schema
router.get('/schema', handleGetSchema);
router.post('/schema', handlePutSchema);

// relationships
router.post('/relationship', handleCreateRelationship);
router.post('/relationship/query', handleGetRelationship);

// lookups
router.post('/lookup/resources', handleLookupResources);
router.post('/lookup/subjects', handleLookupSubjects);

// checking permissions
router.post('/check', handleCheckPermission);
router.post('/check-bulk', handleCheckBulkPermissions);

export default router;