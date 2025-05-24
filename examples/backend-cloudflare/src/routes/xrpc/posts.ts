import { Hono, Context } from 'hono'

import { createRelationship, checkPermission, checkBulkPermissions } from '@/lib/authz'

import { xrpcProxy } from './proxy'
import { createRecord } from '@/lib/storage'

import { createId } from '@paralleldrive/cuid2'
import { create } from '@atproto/common-web/dist/check'

const POST_COLLECTION = 'app.blebbit.authr.post'

// only export
export function addRoutes(app: Hono) {
  app.get('/xrpc/app.blebbit.authr.getPost', getPost)
  app.get('/xrpc/app.blebbit.authr.getPosts', getPosts)
  app.post('/xrpc/app.blebbit.authr.createPost', createPost)
  app.post('/xrpc/app.blebbit.authr.updatePost', updatePost)
  app.post('/xrpc/app.blebbit.authr.deletePost', deletePost)
}

async function getPost(c: Context) {
  console.log("getPost.start", c.get("authrSession"))

  return c.json({
    error: 'Not implemented',
    // payload,
  }, 501)
}


async function getPosts(c: Context) {
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

  const result =
    await c.env.DB
    .prepare('SELECT * FROM records')
    // .prepare('SELECT * FROM records WHERE acct = ? AND nsid = ?')
    // .bind(did, POST_COLLECTION)
    .all()

  var posts = result.results as any[]
  console.log("getPosts.posts", posts)

  // authzed has something about providing a fetch bulk records where they will handle the logic
  //   for getting more results until the page size is met, based on permissions
  // https://authzed.com/docs/spicedb/modeling/protecting-a-list-endpoint#checking-with-checkbulkpermissions
  if (did) {
    const objs = posts.map((post) => {
      return "blog/post:" + post.id
    })
    const permCheck = await checkBulkPermissions(c.env, objs, "read", "blog/user:" + did.replaceAll(":", "_")) as { pairs: any[] }
    // console.log("getPosts.checkSession", JSON.stringify(permCheck, null, 2))

    posts = posts.filter((post, index) => {
      const perm = permCheck.pairs[index]
      // TODO, ensure we have the same id for each item
      return perm?.response?.item?.permissionship === 2
    })
  }

  return c.json({
    posts,
  })
}

async function createPost(c: Context) { 

  const authrSession = c.get("authrSession")
  const pdsSession = c.get("pdsSession")

  const payload = await c.req.json()
  console.log("createPost.payload", payload)

  // DUAL+ Write Problem
  // https://authzed.com/blog/the-dual-write-problem
  // https://www.youtube.com/watch?v=6lDkXrFjuhc

  // who's creating this post?
  var did =  pdsSession?.iss || authrSession?.did || undefined
  console.log("createPost.did", did)

  // must be authenticated to perform writes of any kind
  if (!did) {
    return c.json({
      error: 'Not authenticated',
    }, 401)
  }

  const cid = createId()
  console.log("createPost.cid", cid)
  // write resource and assign owner to creator
  const perm = await createRelationship(c.env, "blog/post:" + cid, "owner", "blog/user:" + did.replaceAll(":", "_"))
  console.log("createPost.perm", perm)

  // write to application database
  const result = await createRecord(c, cid, did, POST_COLLECTION, {
    draft: payload.record.draft,
    title: payload.record.title,
    content: payload.record.content,
  }, payload.public)
  console.log("createPost.result", result)

  // write to account's PDS

  return c.json(result)
}

async function updatePost(c: Context) {

  return c.json({
    error: 'Not implemented',
  }, 501)
}

async function deletePost(c: Context) {

  return c.json({
    error: 'Not implemented',
  }, 501)
}