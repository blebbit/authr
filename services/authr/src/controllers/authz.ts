import { type Context, type Next } from 'hono'
import { HTTPException } from 'hono/http-exception'

import {
  client,
  lookupResources,
  lookupSubjects,
  getRelationship,
  createRelationship,
  checkPermission,
  checkBulkPermission
} from '@/lib/spicedb';

import config from '@/config';

export const hasAuthzApikey = async (c: Context) => {
  const apikey = c.req.header('x-authr-apikey');
  console.log("hasAuthzApikey.apikey", apikey, config.spicedb.adminApikey);

  if (!apikey || apikey !== config.spicedb.adminApikey) {
    return false
  }

  return true

  /*
   * Should also support using sessions and spicedb to determine if the user has access
   * to the spicedb meta resources and endpoints.
   */


  // const session = c.get('session')

  // if (!session) {
  //   throw new HTTPException(401, { message: "Unauthorized" })
  // }
}

export const handleGetSchema = async (c: Context, next: Next) => {
  const hasApikey = await hasAuthzApikey(c);

  if (!hasApikey) {
    return c.json({ message: "Unauthorized" }, { status: 401 });
  }

  // check that user can read the schema
  const schema = await client.readSchema({});

  console.log("Schema:", schema);
  return c.json(schema);
};

export const handlePutSchema = async (c: Context) => {
  const hasApikey = await hasAuthzApikey(c);

  if (!hasApikey) {
    return c.json({ message: "Unauthorized" }, { status: 401 });
  }

  // check that user can write the schema

  return c.json({
    permissions: [
      'read:posts',
      'write:posts',
    ]
  });
};



export const handleLookupResources = async (c: Context) => {
  const hasApikey = await hasAuthzApikey(c);

  if (!hasApikey) {
    return c.json({ message: "Unauthorized" }, { status: 401 });
  }

  const data: any = await c.req.json()
  console.log("lookupResources.data", data)
  const r: any = await lookupResources(data.resource, data.permission, data.subject)
  console.log("lookupResources.r", r)

  return c.json(r)
}

export const handleLookupSubjects = async (c: Context) => {
  const hasApikey = await hasAuthzApikey(c);
  if (!hasApikey) {
    return c.json({ message: "Unauthorized" }, { status: 401 });
  }
  const data: any = await c.req.json()
  console.log("lookupSubjects.data", data)
  const r: any = await lookupSubjects(data.resource, data.permission, data.subject)
  console.log("lookupSubjects.r", r)
  return c.json(r)
}

export const handleGetRelationship = async (c: Context) => {
  const hasApikey = await hasAuthzApikey(c);

  if (!hasApikey) {
    return c.json({ message: "Unauthorized" }, { status: 401 });
  }

  const data: any = await c.req.json()
  console.log("getRelationship.data", data)
  const r: any = await getRelationship(data.resource, data.relation, data.subject)
  console.log("getRelationship.r", r)

  return c.json(r)
}

export const handleCreateRelationship = async (c: Context) => {
  const hasApikey = await hasAuthzApikey(c);

  if (!hasApikey) {
    return c.json({ message: "Unauthorized" }, { status: 401 });
  }

  const data: any = await c.req.json()
  console.log("createRelationship.data", data)
  const r: any = await createRelationship(data.resource, data.relation, data.subject)
  console.log("createRelationship.r", r)

  return c.json(r)
}

export const handleCheckPermission = async (c: Context) => {
  const hasApikey = await hasAuthzApikey(c);

  if (!hasApikey) {
    return c.json({ message: "Unauthorized" }, { status: 401 });
  }

  const data: any = await c.req.json()
  console.log("checkPermission.data", data)
  const r: any = await checkPermission(data.resource, data.permission, data.subject)
  console.log("checkPermission.r", r)

  return c.json(r)
}

export const handleCheckBulkPermissions = async (c: Context) => {
  const hasApikey = await hasAuthzApikey(c);

  if (!hasApikey) {
    return c.json({ message: "Unauthorized" }, { status: 401 });
  }

  const data: any = await c.req.json()
  console.log("checkBulkPermissions.data", data)
  const r: any = await checkBulkPermission(data.resources, data.permission, data.subject)
  console.log("checkBulkPermissions.r", r)

  return c.json(r)
}