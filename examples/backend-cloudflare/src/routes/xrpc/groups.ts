import { Hono, Context } from 'hono'

import { 
  createRelationship,
  updateRelationship,
  deleteRelationship,
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

  app.post('/xrpc/app.blebbit.authr.createGroupMember', createGroupMember)
  app.post('/xrpc/app.blebbit.authr.updateGroupMember', updateGroupMember)
  app.post('/xrpc/app.blebbit.authr.deleteGroupMember', deleteGroupMember)
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
      return "group:" + group.id
    })
    const permCheck = await checkBulkPermissions(c.env, objs, "read", "user:" + did.replaceAll(":", "_")) as { pairs: any[] }
    console.log("getGroups.permCheck", JSON.stringify(permCheck, null, 2))

    groups = groups.filter((group, index) => {
      const perm = permCheck.pairs[index]
      // TODO, ensure we have the same id for each item
      return group.public || perm?.response?.item?.permissionship === 2
    })

  }

  const groupSubjects = await lookupSubjects(c.env, `group:${gid}`, 'read', "user")
  const groupRelations = await getRelationship(c.env, `group:${gid}`, undefined, undefined)
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
      return "group:" + group.id
    })
    const permCheck = await checkBulkPermissions(c.env, objs, "read", "user:" + did.replaceAll(":", "_")) as { pairs: any[] }
    console.log("getGroups.permCheck", JSON.stringify(permCheck, null, 2))

    groups = groups.filter((group, index) => {
      const perm = permCheck.pairs[index]
      // TODO, ensure we have the same id for each item
      return group.public || perm?.response?.item?.permissionship === 2
    })

  }

  const groupPerms = await getRelationship(c.env, "group", undefined, "user:" + did.replaceAll(":", "_"))
  return c.json({
    groups,
    groupPerms,
  })
}

async function createGroup(c: Context) {

  const authrSession = c.get("authrSession")
  const pdsSession = c.get("pdsSession")

  const payload = await c.req.json()
  // TODO, validate payload against lexicon doc
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

  const cuid = createId()
  var result: any
  var perm: any
  // TODO, create cid hash of record

  try {
    console.log("createGroup.cuid", cuid)
    // write resource and assign owner to creator
    perm = await createRelationship(c.env, "group:" + cuid, "owner", "user:" + did.replaceAll(":", "_"))
    console.log("createGroup.perm", perm)
  } catch (err) {
    console.error("createGroup.createRelationship", err)
  }

  try {
    // write to application database
    result = await createRecord(c, cuid, did, GROUP_COLLECTION, payload.record, payload.public)
    console.log("createGroup.result", result)
  } catch (err) {
    console.error("createGroup.createRecord", err)
    // delete relationship
  }

  try {
    // write to account's PDS
  } catch (err) {
    console.error("createGroup.writeToPDS", err)
    // we have the record and permission, we should retry in the background (with pg-boss)
  }

  return c.json({
    ...result,
    cuid,
    perm,
  })
}

async function updateGroup(c: Context) {

  return c.json({
    error: 'Not implemented',
  }, 501)
}


async function canWriteMember(c: Context, group: any, role: string, newDid: string, reqDid: string) {
  var canMod = false
  // anyone can add themselves to a public group
  if (group.public && newDid === reqDid && role === 'member') {
    canMod = true
  }

  if (!canMod) {
    // check if the requester is an owner of the group
    const check = await checkPermission(c.env, `group:${group.id}`, "owner", `user:${reqDid.replaceAll(":", "_")}`)

    console.log("canWriteMember.ownerCheck", check)

    if (check?.allowed === "yes") {
      canMod = true
    }
  }

  return canMod
}

async function getGroupFromDB(c: Context, groupId: string) {
  const groupDb =
    await c.env.DB
    .prepare('SELECT * FROM records WHERE nsid = ? AND id = ?')
    .bind(GROUP_COLLECTION, groupId)
    .all()

  var groups = groupDb.results as any[]
  console.log("addGroupMember.groups", groups)
  if (!groups || groups.length === 0) {
    return null
  }

  return groups[0]
}

async function commonGroupMemberChecks(c: Context) {
  const authrSession = c.get("authrSession")
  const pdsSession = c.get("pdsSession")
  const reqDid =  pdsSession?.iss || authrSession?.did || undefined

  // must be authenticated to perform writes of any kind
  if (!reqDid) {
    return c.json({
      error: 'Not authenticated',
    }, 401)
  }

  // unpack the payload
  const payload = await c.req.json()
  console.log("addGroupMember.payload", payload)
  const { groupId, role, did: newDid } = payload

  // lookup the group in the database
  const group = await getGroupFromDB(c, groupId)
  if (!group) {
    return c.json({
      error: 'Group not found',
    }, 404)
  }

  const canAdd = await canWriteMember(c, group, role, newDid, reqDid)
  if (!canAdd) {
    return c.json({
      error: 'Not authorized to add members to this group',
    }, 403)
  }
  return {
    groupId,
    role,
    newDid,
    reqDid,
  }
}

async function createGroupMember(c: Context) {
 const result = await commonGroupMemberChecks(c) as any
  if (result instanceof Response) {
    return result
  }
  console.log("createGroupMember.payload", result)
  const { groupId, role, newDid } = result

  //
  // TODO, enable both users and groups to be members
  //
  // (same for other cruds in this category)

  // add the member to the group
  const permission = await createRelationship(c.env, `group:${groupId}`, role, `user:${newDid.replaceAll(":", "_")}`)

  console.log("createGroupMember.permission", permission)

  return c.json({
    ...result,
    permission,
  }, 200)
}

async function updateGroupMember(c: Context) {
 const result = await commonGroupMemberChecks(c) as any
  if (result instanceof Response) {
    return result
  }
  console.log("updateGroupMember.payload", result)
  const { groupId, role, newDid } = result

  // update member of the group
  const perm = await updateRelationship(c.env, `group:${groupId}`, role, `user:${newDid.replaceAll(":", "_")}`)
  console.log("updateGroupMember.perm", perm)

  return c.json({
    ...result,
    permission: perm,
  }, 200)
}

async function deleteGroupMember(c: Context) {
  const result = await commonGroupMemberChecks(c) as any
  if (result instanceof Response) {
    return result
  }
  console.log("deleteGroupMember.payload", result)
  const { groupId, role, newDid, reqDid } = result

  // todo, owner should not be able to remote thmeselves
  if (role === 'owner' && reqDid === newDid) {
    return c.json({
      error: 'Cannot remove yourself as owner',
    }, 403)
  }

  // remove member from the group
  const perm = await deleteRelationship(c.env, `group:${groupId}`, role, `user:${newDid.replaceAll(":", "_")}`)
  console.log("deleteGroupMember.perm", perm)

  return c.json({
    ...result,
    permission: perm,
  }, 200)
}

async function deleteGroup(c: Context) {

  const check = await commonGroupMemberChecks(c) as any
  if (check instanceof Response) {
    return check
  }
  console.log("addGroupMember.payload", check)
  const { groupId, reqIsOwner } = check

  // todo, owner should not be able to remote thmeselves
  if (!reqIsOwner) {
    return c.json({
      error: 'Cannot delete group, you are not an owner',
    }, 403)
  }

  // first remove from database
  const result =
    await c.env.DB
    .prepare('SELECT * FROM records WHERE nsid = ? AND id = ?') 
    .bind(GROUP_COLLECTION, groupId)
    .all()
  var groups = result.results as any[]
  console.log("getGroups.groups", groups)


  // then remove permissions tied to the group
  const perm = await deleteRelationship(c.env, `group:${groupId}`, undefined, undefined)

  return c.json({
    message: 'Group deleted successfully',
    perm,
  })
}
