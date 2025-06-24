import { Hono, Context } from 'hono'

import { createRelationship, checkPermission, checkBulkPermissions } from '@/lib/authz'

import { xrpcProxy } from './proxy'
import { createRecord } from '@/lib/storage'

import { createId } from '@paralleldrive/cuid2'

const FOLDER_COLLECTION = 'app.blebbit.authr.folder'

// only export
export function addRoutes(app: Hono) {
  app.get('/xrpc/app.blebbit.authr.getFolders', getFolders)
  app.get('/xrpc/app.blebbit.authr.getFolder', getFolder)
  app.post('/xrpc/app.blebbit.authr.createFolder', createFolder)
  app.post('/xrpc/app.blebbit.authr.updateFolder', updateFolder)
  app.post('/xrpc/app.blebbit.authr.deleteFolder', deleteFolder)

  app.post('/xrpc/app.blebbit.authr.createFolderRelation', createFolderRelation)
  app.post('/xrpc/app.blebbit.authr.updateFolderRelation', updateFolderRelation)
  app.post('/xrpc/app.blebbit.authr.deleteFolderRelation', deleteFolderRelation)
}

async function getFolder(c: Context) {
  console.log("getPost.start", c.get("authrSession"))

  return c.json({
    error: 'Not implemented',
    // payload,
  }, 501)
}


async function getFolders(c: Context) {
  const authrSession = c.get("authrSession")
  const pdsSession = c.get("pdsSession")
  // console.log("getPosts.authrSession", authrSession)
  // console.log("getPosts.pdsSession", pdsSession)
  // console.log("getPosts.headers", c.req.header())

  // this little trick allows us to proxy
  // our own api through the user's pds
  const proxy = c.req.header('x-authr-recursive-proxy')
  if (proxy) {
    console.log("getPosts.recursive-proxy", proxy)
    return xrpcProxy(c)
  }

  // console.log("getPosts.our-handler", "incoming request is from the user's PDS")


  // see if we have something to put permissions on
  var did =  pdsSession?.iss || authrSession?.did || undefined
  // todo
  // - check our auth and pds-proxy auth
  // - implement actual getPosts

  // TODO, need to use a cursor and fill results with authorized items until limit is met

  const result =
    await c.env.DB
    .prepare('SELECT * FROM records WHERE nsid = ?')
    .bind(FOLDER_COLLECTION)
    .all()

  var folders = result.results as any[]
  // console.log("getPosts.folders", folders)

  // authzed has something about providing a fetch bulk records where they will handle the logic
  //   for getting more results until the page size is met, based on permissions
  // https://authzed.com/docs/spicedb/modeling/protecting-a-list-endpoint#checking-with-checkbulkpermissions
  if (did) {
    const objs = folders.map((folder) => {
      return "folder:" + folder.id
    })
    const permCheck = await checkBulkPermissions(c.env, objs, "read", "user:" + did.replaceAll(":", "_")) as { pairs: any[] }
    // console.log("getPosts.permCheck", JSON.stringify(permCheck, null, 2))

    folders = folders.filter((folder, index) => {
      const perm = permCheck.pairs[index]
      // TODO, ensure we have the same id for each item
      return folder.public || perm?.response?.item?.permissionship === 2
    })
  }

  return c.json({
    folders,
  })
}

async function createFolder(c: Context) { 

  const authrSession = c.get("authrSession")
  const pdsSession = c.get("pdsSession")

  const payload = await c.req.json()
  console.log("createPost.payload", payload)

  // DUAL+ Write Problem
  // https://authzed.com/blog/the-dual-write-problem
  // https://www.youtube.com/watch?v=6lDkXrFjuhc

  // who's creating this folder?
  var did =  pdsSession?.iss || authrSession?.did || undefined
  console.log("createPost.did", did)

  // must be authenticated to perform writes of any kind
  if (!did) {
    return c.json({
      error: 'Not authenticated',
    }, 401)
  }

  const cuid = createId()
  console.log("createPost.cid", cuid)
  // write resource and assign owner to creator
  const perm = await createRelationship(c.env, "folder:" + cuid, "owner", "user:" + did.replaceAll(":", "_"))
  console.log("createPost.perm", perm)

  // write to application database
  const result = await createRecord(c, cuid, did, POST_COLLECTION, {
    draft: payload.record.draft,
    title: payload.record.title,
    content: payload.record.content,
  }, payload.public)
  console.log("createPost.result", result)

  // write to account's PDS

  return c.json(result)
}

async function updateFolder(c: Context) {

  return c.json({
    error: 'Not implemented',
  }, 501)
}

async function deleteFolder(c: Context) {

  return c.json({
    error: 'Not implemented',
  }, 501)
}

async function createFolderRelation(c: Context) {

  return c.json({
    error: 'Not implemented',
  }, 501)
}

async function updateFolderRelation(c: Context) {

  return c.json({
    error: 'Not implemented',
  }, 501)
}

async function deleteFolderRelation(c: Context) {

  return c.json({
    error: 'Not implemented',
  }, 501)
}