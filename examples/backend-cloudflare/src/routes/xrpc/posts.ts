import { Hono, Context } from 'hono'

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

  const payload = await c.req.json()
  console.log("getPost.payload", payload) 

  return c.json({
    error: 'Not implemented',
    payload,
  }, 501)
}

async function getPosts(c: Context) {
  console.log("getPostsi.start", c.get("authrSession"))

  const payload = await c.req.json()
  console.log("getPosts.payload", payload)

  return c.json({
    error: 'Not implemented',
    payload,
  }, 501)
}

async function createPost(c: Context) { 

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