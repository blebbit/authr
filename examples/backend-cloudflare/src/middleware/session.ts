import { Context, Next } from 'hono'
import { getCookie } from 'hono/cookie'
import { verifyJwt } from '@atproto/xrpc-server'

import { getConfig } from '../config'

export type Session = {
  did: string,
  pds: string,
  handle: string,
}

export const DefaultSession: Session = {
  did: "",
  pds: "",
  handle: "",
};


// Get authr cookie and session details
export const sessions = (options: { required: boolean } = { required: false }) => {

  // TODO...
  // - check if x-apikey is set (for internal app callsO)
  // - check if atproto-proxy is set (for service-to-service calls proxied by the PDS)
  // - make options have more required kinds?
  //   (or separate out into different middleware that just checks if things have been set by this middleware?)

  const middleware = async (c: Context, next: Next) => {
    const config = getConfig(c.env)

    const authrSession = await getAuthrSession(c)
    const pdsSession = await getPdsSession(c)

    if (options.required && !authrSession) {
      return c.json({
        error: 'Session not found',
      }, 401)
    }

    if (authrSession) {
      c.set("authrSession", authrSession)

      const results = await c.env.KV.get(authrSession.did)
      if (!results && c.req.method === 'POST') {
        return c.json({
          error: 'Session not found',
        }, 401)
      }
      const atSession = JSON.parse(results as string)

      if (atSession) {
        c.set("atSession", atSession)
      }
    }

    // if atproto-proxy is set, we are receiving a request from a PDS
    //   verify with the method described here:
    // http://docs.bsky.app/docs/advanced-guides/service-auth#usage

    await next()
  }

  return middleware
}

export async function getAuthrSession(c: Context): Promise<Session | null> {
  const config = getConfig(c.env)
  // console.log("config:", config)

  const cookie = getCookie(c, config.cookie.name);

  if (!cookie) {
    // console.log(`Cookie '${config.cookie.name}' not found.`);
    return null;
  }

  try {
    // import an ES module in a CommonJS module. Specifically, the jose library is now distributed as an ES module, and your index.ts file is being treated as a CommonJS module.
    const jose = await import('jose');

    // console.log("getSession.cookie:", config.cookie);

    // Verify and decode the JWT using jwtVerify from jose
    const payload = await jose.decodeJwt(cookie)
    // console.log("getSession.payload:", payload);

    return payload as Session;
  } catch (error) {
    console.error('Error verifying session JWT:', error);
    return null; // or handle the error as needed
  }
}

// for service based auth via the pds
export async function getPdsSession(c: Context): Promise<any | null> {
  // check for header
  const authorizationHeader = c.req.header('Authorization')
  if (authorizationHeader) {
    // check path
    const path = c.req.path
    if (!path.startsWith('/xrpc/')) {
      return null
    }

    const xrpcPath = path.split('/xrpc/')[1]

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
      xrpcPath,
      getSigningKey
    )

    // TODO, store the payload.jti for some TTL so we can ensure not used again

    // console.log("getPdsSession.payload", payload)
    c.set("pdsSession", payload)
    return payload
  }
  return null
}