import { type Context, type Next } from 'hono'
import { HTTPException } from 'hono/http-exception'

import {
  client,
  getRelationship as get,
  createRelationship as create,
  checkPermission as check,
  checkBulkPermission as checkBulk
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

export const getSchema = async (c: Context, next: Next) => {
  const hasApikey = await hasAuthzApikey(c);

  if (!hasApikey) {
    return c.json({ message: "Unauthorized" }, { status: 401 });
  }

  // check that user can read the schema
  const schema = await client.readSchema({});

  console.log("Schema:", schema);
  return c.json(schema);
};

export const putSchema = async (c: Context) => {
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



export const getRelationship = async (c: Context) => {
  const hasApikey = await hasAuthzApikey(c);

  if (!hasApikey) {
    return c.json({ message: "Unauthorized" }, { status: 401 });
  }

  const data: any = await c.req.json()
  console.log("createRelationship.data", data)
  const r: any = await get(data.resource, data.relation, data.subject)
  console.log("createRelationship.r", r)

  return c.json(r)
}

export const createRelationship = async (c: Context) => {
  const hasApikey = await hasAuthzApikey(c);

  if (!hasApikey) {
    return c.json({ message: "Unauthorized" }, { status: 401 });
  }

  const data: any = await c.req.json()
  console.log("createRelationship.data", data)
  const r: any = await create(data.resource, data.relation, data.subject)
  console.log("createRelationship.r", r)

  return c.json(r)
}

export const checkPermission = async (c: Context) => {
  const hasApikey = await hasAuthzApikey(c);

  if (!hasApikey) {
    return c.json({ message: "Unauthorized" }, { status: 401 });
  }

  const data: any = await c.req.json()
  console.log("checkBulkPermission.data", data)
  const r: any = await check(data.resource, data.permission, data.subject)
  console.log("checkBulkPermission.r", r)

  return c.json(r)
}

export const checkBulkPermissions = async (c: Context) => {
  const hasApikey = await hasAuthzApikey(c);

  if (!hasApikey) {
    return c.json({ message: "Unauthorized" }, { status: 401 });
  }

  const data: any = await c.req.json()
  console.log("checkBulkPermissions.data", data)
  const r: any = await checkBulk(data.resources, data.permission, data.subject)
  console.log("checkBulkPermissions.r", r)

  return c.json(r)
}