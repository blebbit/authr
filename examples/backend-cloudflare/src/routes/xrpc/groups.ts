import { Hono, Context } from 'hono'

import { 
  createRelationship,
  checkPermission,
  checkBulkPermissions,
  getRelationship,
  lookupSubjects,
  lookupResources,
} from '@/lib/authz'

import { xrpcProxy } from './proxy'
import { createRecord } from '@/lib/storage'

import { createId } from '@paralleldrive/cuid2'
import { create } from '@atproto/common-web/dist/check'
import { get } from 'http'

const GROUP_COLLECTION = 'app.blebbit.authr.group'

// only export
export function addRoutes(app: Hono) {
  app.get('/xrpc/app.blebbit.authr.getGroup', getGroup)
  app.get('/xrpc/app.blebbit.authr.getGroups', getGroups)
  app.post('/xrpc/app.blebbit.authr.createGroup', createGroup)
  app.post('/xrpc/app.blebbit.authr.updateGroup', updateGroup)
  app.post('/xrpc/app.blebbit.authr.deleteGroup', deleteGroup)
}

async function getGroup(c: Context) {
  const authrSession = c.get("authrSession")
  const pdsSession = c.get("pdsSession")

  var did =  pdsSession?.iss || authrSession?.did || undefined
  var gid = c.req.query('id') || c.req.query('groupId') || undefined

  const result =
    await c.env.DB
    .prepare('SELECT * FROM records WHERE nsid = ? AND id = ?')
    .bind(GROUP_COLLECTION, gid)
    .all()

  var groups = result.results as any[]
  console.log("getGroups.groups", groups)

  if (did) {
    const objs = groups.map((group) => {
      return "blog/group:" + group.id
    })
    const permCheck = await checkBulkPermissions(c.env, objs, "read", "blog/user:" + did.replaceAll(":", "_")) as { pairs: any[] }
    console.log("getGroups.permCheck", JSON.stringify(permCheck, null, 2))

    groups = groups.filter((group, index) => {
      const perm = permCheck.pairs[index]
      // TODO, ensure we have the same id for each item
      return group.public || perm?.response?.item?.permissionship === 2
    })

  }

  const groupSubjects = await lookupSubjects(c.env, `blog/group:${gid}`, 'read', "blog/user")
  const groupRelations = await getRelationship(c.env, `blog/group:${gid}`, undefined, undefined)
  return c.json({
    groups,
    groupSubjects,
    groupRelations,
  })
}


async function getGroups(c: Context) {
  const authrSession = c.get("authrSession")
  const pdsSession = c.get("pdsSession")
  // console.log("getPosts.authrSession", authrSession)
  // console.log("getPosts.pdsSession", pdsSession)
  // console.log("getPosts.headers", c.req.header())

  // this little trick allows us to proxy
  // our own api through the user's pds
  const proxy = c.req.header('x-authr-recursive-proxy')
  if (proxy) {
    console.log("getGroups.recursive-proxy", proxy)
    return xrpcProxy(c)
  }

  // console.log("getGroups.our-handler", "incoming request is from the user's PDS")


  // see if we have something to put permissions on
  var did =  pdsSession?.iss || authrSession?.did || undefined
  // todo
  // - check our auth and pds-proxy auth
  // - implement actual getGroups

  const result =
    await c.env.DB
    .prepare('SELECT * FROM records WHERE nsid = ?')
    .bind(GROUP_COLLECTION)
    .all()

  var groups = result.results as any[]
  console.log("getGroups.groups", groups)

  // authzed has something about providing a fetch bulk records where they will handle the logic
  //   for getting more results until the page size is met, based on permissions
  // https://authzed.com/docs/spicedb/modeling/protecting-a-list-endpoint#checking-with-checkbulkpermissions
  if (did) {
    const objs = groups.map((group) => {
      return "blog/group:" + group.id
    })
    const permCheck = await checkBulkPermissions(c.env, objs, "read", "blog/user:" + did.replaceAll(":", "_")) as { pairs: any[] }
    console.log("getGroups.permCheck", JSON.stringify(permCheck, null, 2))

    groups = groups.filter((group, index) => {
      const perm = permCheck.pairs[index]
      // TODO, ensure we have the same id for each item
      return group.public || perm?.response?.item?.permissionship === 2
    })

  }

  const groupPerms = await getRelationship(c.env, "blog/group", undefined, "blog/user:" + did.replaceAll(":", "_"))
  return c.json({
    groups,
    groupPerms,
  })
}

async function createGroup(c: Context) {

  const authrSession = c.get("authrSession")
  const pdsSession = c.get("pdsSession")

  const payload = await c.req.json()
  console.log("createGroup.payload", payload)

  // DUAL+ Write Problem
  // https://authzed.com/blog/the-dual-write-problem
  // https://www.youtube.com/watch?v=6lDkXrFjuhc

  // who's creating this group?
  var did =  pdsSession?.iss || authrSession?.did || undefined
  console.log("createGroup.did", did)

  // must be authenticated to perform writes of any kind
  if (!did) {
    return c.json({
      error: 'Not authenticated',
    }, 401)
  }

  const cid = createId()
  console.log("createGroup.cid", cid)
  // write resource and assign owner to creator
  const perm = await createRelationship(c.env, "blog/group:" + cid, "owner", "blog/user:" + did.replaceAll(":", "_"))
  console.log("createGroup.perm", perm)

  // write to application database
  const result = await createRecord(c, cid, did, GROUP_COLLECTION, {
    name: payload.record.name,
  }, payload.public)
  console.log("createGroup.result", result)

  // write to account's PDS

  return c.json(result)
}

async function updateGroup(c: Context) {

  return c.json({
    error: 'Not implemented',
  }, 501)
}

async function deleteGroup(c: Context) {

  return c.json({
    error: 'Not implemented',
  }, 501)
}
