import { Hono, Context } from 'hono'

import { getSession } from '../../lib/session'
import { genDpopProof } from '../../lib/dpop'

// only export
export function addRoutes(app: Hono) {
  app.get('/xrpc/*', xrpcProxy)
  app.post('/xrpc/*', xrpcProxy)
}

// handlers
export async function xrpcProxy(c: Context) {

 // Get authr session details
  const authrSession = c.get("authrSession")
  const atSession = c.get("atSession")


  // TODO, this is where we need to handle permissions too, if enabled
  // TODO, we only want to use the session pds if the request is for the current user repo...


  // construct our proxied URL
  const url = new URL(c.req.url)
  let proxyUrl = `${authrSession.pds}${url.pathname}${url.search}`
  // console.log("xrpcProxy.proxyUrl:", proxyUrl)

  // setup common headers
  const commonHeaders: any = {
    'Content-Type': c.req.header('Content-Type') || 'application/json',
    'Accept': c.req.header('Accept') || 'application/json',
    'Authorization': `DPoP ${atSession.access_token}`,
  }
  const ap = c.req.header('atproto-proxy')
  if (ap && ap.length > 0) {
    commonHeaders['atproto-proxy'] = ap
  }
  const al = c.req.header('atproto-accept-labelers')
  if (al && al.length > 0) {
    commonHeaders['atproto-accept-labelers'] = al
  }

  // generate DPoP proof
  const dpop_jwt = await genDpopProof(c.req.method, atSession, proxyUrl)

  // construct payload
  const payload1: any = {
    method: c.req.method,
    headers: {
      ...commonHeaders,
      'DPoP': dpop_jwt,
    },
  }
  if (c.req.method === 'POST') {
    payload1.body = await c.req.text()
  }

  // send request, likely to fail with 401 because we need a DPoP nonce
  const resp = await fetch(proxyUrl, payload1)
  // console.log("xrpcProxy.resp1:", resp)

  // bad request, let's try to fix it (most often dpop nonce)
  if (resp.status === 400 || resp.status === 401) {
    const nonce = resp.headers.get('dpop-nonce')

    const data: any = await resp.json()
    if (data.error && (data.error === "use_dpop_nonce")) {

      // calculate new dpop proof with nonce
      const dpop_jwt = await genDpopProof(c.req.method, atSession, proxyUrl, nonce as string)

      const payload2: any = {
        method: c.req.method,
        headers: {
          ...commonHeaders,
          'DPoP': dpop_jwt,
        },
      }
      console.log("xrpcProxy.payload:", payload2)
      if (c.req.method === 'POST') {
        payload2.body = await c.req.text()
      }

      const resp2 = await fetch(proxyUrl, payload2)
      // console.log("xrpcProxy.resp:", resp2)

      return resp2
    }
    return c.json(data)
  }

  return resp;
}
