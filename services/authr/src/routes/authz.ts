import { Hono } from 'hono';

import {
  handleGetSchema,
  handlePutSchema,
  handleGetRelationship,
  handleCreateRelationship,
  handleUpdateRelationship,
  handleDeleteRelationship,
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
router.get('/relationship', handleGetRelationship);
router.post('/relationship', handleCreateRelationship);
router.put('/relationship', handleUpdateRelationship);
router.delete('/relationship', handleDeleteRelationship);

// lookups
router.post('/lookup/resources', handleLookupResources);
router.post('/lookup/subjects', handleLookupSubjects);

// checking permissions
router.post('/check', handleCheckPermission);
router.post('/check-bulk', handleCheckBulkPermissions);

export default router;