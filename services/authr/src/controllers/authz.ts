import { type Context, type Next } from 'hono'

import {
  client,
  createRelationship as create,
  checkPermission as check,
  checkBulkPermission as checkBulk
} from '@/lib/spicedb';

export const getSchema = async (c: Context, next: Next) => {
  const session = c.get('session')

  // if (!session) {
  //   return c.json({ message: "Unauthorized" }, { status: 401 });
  // }

  // check that user can read the schema
  const schema = await client.readSchema({});

  console.log("Schema:", schema);
  return c.json(schema);
};

export const putSchema = async (c: Context) => {
  const session = c.get('session')

  if (!session) {
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

export const createRelationship = async (c: Context) => {
  const data: any = await c.req.json()
  console.log("createRelationship.data", data)
  const r: any = await create(data.resource, data.relation, data.subject)
  console.log("createRelationship.r", r)

  return c.json(r)
}

export const checkPermission = async (c: Context) => {
  const data: any = await c.req.json()
  console.log("checkBulkPermission.data", data)
  const r: any = await check(data.resource, data.permission, data.subject)
  console.log("checkBulkPermission.r", r)

  return c.json(r)
}

export const checkBulkPermissions = async (c: Context) => {
  const data: any = await c.req.json()
  console.log("checkBulkPermissions.data", data)
  const r: any = await checkBulk(data.resources, data.permission, data.subject)
  console.log("checkBulkPermissions.r", r)

  return c.json(r)
}