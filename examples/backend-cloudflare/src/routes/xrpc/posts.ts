import { Hono, Context } from 'hono'
import { P256Keypair, Secp256k1Keypair } from '@atproto/crypto'
import { createServiceJwt, verifyJwt } from '@atproto/xrpc-server'
import { IdResolver } from '@atproto/identity'

import { xrpcProxy } from './proxy'

import { getConfig } from '../../config'

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
  console.log("getPosts.start", c.get("authrSession"))

  // this little trick allows us to proxy
  // our own api through the user's pds
  const proxy = c.req.header('x-authr-recursive-proxy')
  if (proxy) {
    console.log("getPosts.recursive-proxy", proxy)
    return xrpcProxy(c)
  }

  console.log("getPosts.our-handler", proxy)

  console.log("getPosts.header", c.req.header())

  const authorizationHeader = c.req.header('Authorization')
  if (authorizationHeader) {
    const jwt = authorizationHeader.split(' ')[1]

    // Verifying a service JWT
    // helper method to resolve a user's DID to their atproto signing key
    const getSigningKey = async (
      did: string,
      forceRefresh: boolean,
    ): Promise<string> => {
      const resp = await fetch(`https://plc.blebbit.dev/${did}`)
      const doc: any = await resp.json()
      const key = doc.verificationMethod[0].publicKeyMultibase

      return `did:key:${key}` // blebbit.app
    }

    // it is important to always check the aud & lxm of the provided service JWT
    const payload = await verifyJwt(
      jwt,
      `did:web:${c.env.ATPROTO_SERVICE_DOMAIN}`,
      "app.blebbit.authr.getPosts",
      getSigningKey
    )
    console.log("getPosts.payload", payload)

    // TODO, memorize the payload.jti to ensure it is not used again
  }

  // todo
  // - check our auth and pds-proxy auth
  // - implement actual getPosts

  return c.json({
    posts: [{
      id: '1',
      title: 'First Post',
      content: 'This is the first post.',
    },{
      id: '2',
      title: 'Second Post',
      content: 'This is the second post.',
    }]
  })
}

async function createPost(c: Context) { 

  const authrSession = c.get("authrSession")
  const atSession = c.get("atSession")
  console.log("createPost.start", authrSession)
  const payload = await c.req.json()
  console.log("createPost.payload", payload)

  return c.json({
    error: 'Not implemented',
  }, 501)
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